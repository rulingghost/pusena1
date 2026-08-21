const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-pusena-token',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const jwtSecret = Deno.env.get('JWT_SECRET') ?? '';
    const groqKey = Deno.env.get('GROQ_API_KEY') ?? '';
    const model = Deno.env.get('GROQ_MODEL') || DEFAULT_MODEL;

    const userToken = req.headers.get('x-pusena-token')
      || bearer(req.headers.get('Authorization'));
    const user = await verifyHs256(userToken, jwtSecret);
    if (!user?.sub) {
      return json({ error: 'Oturum geçersiz' }, 401);
    }

    const body = await req.json().catch(() => ({})) as {
      question?: string;
      history?: Array<{ sender?: string; text?: string }>;
    };
    const question = String(body.question ?? '').trim();
    if (!question) {
      return json({ error: 'Soru boş olamaz' }, 400);
    }

    const reply = groqKey
      ? await askGroq(groqKey, model, question, body.history ?? [])
      : null;

    return json(reply ?? fallbackReply(question));
  } catch (err) {
    console.error(err);
    return json(fallbackReply(''), 200);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function bearer(header: string | null): string {
  if (!header) return '';
  return header.replace(/^Bearer\s+/i, '').trim();
}

async function verifyHs256(token: string, secret: string): Promise<{ sub?: string; email?: string } | null> {
  if (!token || !secret || token.split('.').length !== 3) return null;
  const [h, p, s] = token.split('.');
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    'HMAC',
    key,
    b64urlToBytes(s),
    new TextEncoder().encode(`${h}.${p}`),
  );
  if (!ok) return null;
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p))) as {
    sub?: string;
    email?: string;
    exp?: number;
  };
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;
  return payload;
}

function b64urlToBytes(input: string): Uint8Array {
  const pad = '='.repeat((4 - (input.length % 4)) % 4);
  const b64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function askGroq(
  apiKey: string,
  model: string,
  question: string,
  history: Array<{ sender?: string; text?: string }>,
) {
  const system = `You are Pusena, a careful women's health assistant in a period, fertility, pregnancy and relationship app.
Answer in Turkish. Be concrete, calm and useful. Never invent cycle days, hormone levels, diagnoses, lab results or baby size.
If you do not have a fact, say so instead of guessing.
Stay on topic: cycle, pregnancy, fertility, symptoms, nutrition, sleep, relationship support, or how to use Pusena.
If symptoms sound urgent (heavy bleeding, fainting, reduced fetal movement, high fever, severe pain), tell them to seek medical care now.
You are not a doctor. Keep wellness advice general.
Return ONLY valid JSON:
{"text":"plain reply, 2-5 short paragraphs or a short list","options":["chip 1","chip 2","chip 3"]}`;

  const prior = history.slice(-8).filter((m) => m?.text?.trim()).map((m) => ({
    role: m.sender === 'assistant' ? 'assistant' : 'user',
    content: String(m.text).slice(0, 800),
  }));

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      max_tokens: 700,
      messages: [
        { role: 'system', content: system },
        ...prior,
        { role: 'user', content: question.slice(0, 2000) },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
  const raw = data.choices?.[0]?.message?.content?.trim();
  if (!raw) return null;
  const parsed = parseGroqContent(raw);
  if (!parsed.text || parsed.text.length < 8) return null;
  return {
    id: `rep-${Date.now()}`,
    sender: 'assistant',
    text: parsed.text,
    options: parsed.options,
    timestamp: 'Şimdi',
  };
}

function parseGroqContent(raw: string): { text: string; options: string[] } {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const tryParse = (value: string) => {
    try {
      const json = JSON.parse(value) as { text?: string; options?: string[] };
      if (json.text?.trim()) {
        const options = Array.isArray(json.options)
          ? json.options.filter((o) => typeof o === 'string' && o.trim()).slice(0, 3)
          : [];
        return {
          text: json.text.trim(),
          options: options.length ? options : ['Başka bir konu sor', 'Semptom kaydet'],
        };
      }
    } catch { /* ignore */ }
    return null;
  };
  return tryParse(cleaned)
    || (cleaned.match(/\{[\s\S]*\}/) ? tryParse(cleaned.match(/\{[\s\S]*\}/)![0]) : null)
    || {
      text: cleaned.replace(/\{[\s\S]*\}/, '').trim()
        || 'Kayıtlarınıza göre net bir cevap çıkaramadım. Soruyu biraz daha somut yazar mısınız?',
      options: ['Başka bir konu sor', 'Semptom kaydet', 'Makalelere göz at'],
    };
}

function fallbackReply(question: string) {
  const q = question.toLocaleLowerCase('tr-TR');
  let text =
    'Şu anda canlı asistan yanıtına ulaşamadım, bu yüzden genel bir not bırakıyorum. Tıbbi teşhis koymam; semptomlarınız şiddetliyse bir sağlık uzmanına danışın.';
  let options = ['Tekrar dene', 'Semptom kaydet', 'Makalelere göz at'];
  if (q.includes('hormon') || q.includes('östrojen') || q.includes('ostrojen')) {
    text = 'Hormon düzeyini buradan ölçemem. Döngü kaydınız varsa evreye göre östrojen genellikle foliküler dönemde yükselir. Kendi semptomlarınızı kaydetmek daha işe yarar.';
    options = ['Semptom kaydet', 'Döngümü incele'];
  } else if (q.includes('yemek') || q.includes('beslen') || q.includes('diyet')) {
    text = 'Genel olarak düzenli öğün, su, demir ve protein kaynakları çoğu döngü ve gebelik döneminde işe yarar. Size özel bir diyet yazmam.';
    options = ['Semptom kaydet', 'Makalelere göz at'];
  }
  return {
    id: `rep-${Date.now()}`,
    sender: 'assistant',
    text,
    options,
    timestamp: 'Şimdi',
  };
}
