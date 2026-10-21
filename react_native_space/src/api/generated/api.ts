// @ts-nocheck
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  ActiveModulesResponseDto,
  AdminCommentsListResponseDto,
  AdminControllerGetBabyNamesParams,
  AdminControllerGetCommentsParams,
  AdminControllerGetDeletedAccountsParams,
  AdminControllerGetPostsParams,
  AdminControllerGetPostsWithCommentsParams,
  AdminControllerGetReportedAiResponses200Item,
  AdminControllerGetReportedPostsParams,
  AdminControllerGetUsersParams,
  AdminControllerUpdateArticle200,
  AdminDeletedAccountsResponseDto,
  AdminPostsListResponseDto,
  AdminStatsDto,
  AdminUpdateArticleDto,
  AdminUpdateBabyNameDto,
  AdminUpdateCommentDto,
  AdminUpdateFaqDto,
  AdminUpdateMythDto,
  AdminUpdatePostDto,
  AdminUpdateSymptomTypeDto,
  AdminUserDetailDto,
  AdminUsersListResponseDto,
  AllWeeksResponseDto,
  AnswerActionDto,
  AnswerCoupleQuestionDto,
  AppleAuthDto,
  ArticlesControllerGetArticleById200,
  ArticlesControllerGetArticlesParams,
  ArticlesControllerGetFaqsParams,
  AssistantControllerGetDailyInsight200,
  AssistantResponseDto,
  AuthControllerGoogleAuthParams,
  AuthControllerGoogleCallbackParams,
  AuthResponseDto,
  BabyNamesResponseDto,
  CalendarResponseDto,
  ChangePasswordDto,
  ChatAssistantDto,
  CommentResponseDto,
  CommentsListResponseDto,
  CommunityControllerGetCommentsParams,
  CommunityControllerGetMyPostsParams,
  CommunityControllerGetPostsParams,
  CommunityControllerGetSavedPostsParams,
  CommunityControllerGetUserPostsParams,
  CommunityControllerSearchUsersParams,
  CommunityPostResponseDto,
  CompleteSetupResponseDto,
  CoupleChatDto,
  CreateCommentDto,
  CreatePostDto,
  CreatePregnancyDto,
  CreatePregnancyResponseDto,
  CreateRelationshipDto,
  CreateSpecialDateDto,
  CreateSymptomsDto,
  DashboardResponseDto,
  DeleteAccountDto,
  EditPostDto,
  EndPeriodDto,
  EndPeriodResponseDto,
  ExchangeCodeDto,
  ForgotPasswordDto,
  InsightsResponseDto,
  LikeResponseDto,
  LocationUpdateDto,
  LoginDto,
  MeResponseDto,
  MediaControllerGetParams,
  NotificationSettingsDto,
  NotificationsControllerGetAllParams,
  NotificationsListResponseDto,
  PairPartnerDto,
  PartnerInfoDto,
  PeriodControllerCalendarParams,
  PeriodControllerFertility200,
  PeriodControllerHistoryParams,
  PeriodDayResponseDto,
  PeriodHistoryResponseDto,
  PeriodLogDto,
  PeriodResponseDto,
  PeriodSetupDto,
  PeriodSetupResponseDto,
  PostsListResponseDto,
  PregnancyControllerGetBabyNamesParams,
  PregnancyControllerPostpartumReminders201,
  PregnancyResponseDto,
  PrivacySettingsDto,
  PublicUserResponseDto,
  RefreshTokenDto,
  RelationshipControllerListMessagesParams,
  RelationshipResponseDto,
  ReportAssistantResponseDto,
  ReportPostDto,
  ResetPasswordDto,
  SaveAssessmentDto,
  SaveResponseDto,
  SendNotificationDto,
  SendNotificationResponseDto,
  SendNudgeDto,
  SetBabyNameDto,
  SettingsResponseDto,
  SignupDto,
  SpecialDateResponseDto,
  SpecialDatesControllerGetAllParams,
  SpecialDatesListResponseDto,
  StartPeriodDto,
  StartPeriodResponseDto,
  SuccessMessageResponseDto,
  SuccessResponseDto,
  SymptomHistoryResponseDto,
  SymptomTypesResponseDto,
  SymptomsControllerGetParams,
  SymptomsResponseDto,
  TokensResponseDto,
  UnreadCountResponseDto,
  UpdateAdminUserDto,
  UpdateLanguageDto,
  UpdateModulesDto,
  UpdateNotificationsDto,
  UpdatePregnancyDto,
  UpdatePrivacyDto,
  UpdateProfileDto,
  UpdateRelationshipDto,
  UpdateSpecialDateDto,
  UpdateWeekContentDto,
  UpdatedWeekContentResponseDto,
  UpsertMemoryDto,
  UserProfileResponseDto,
  UsersControllerGetAssessment200,
  WebDeleteAccountDto,
  WeekContentResponseDto
} from './schemas';

import { customFetch } from '../customFetch';
import type { ErrorType , BodyType } from '../customFetch';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAppControllerGetHelloUrl = () => {




  return `/`
}

export const appControllerGetHello = async ( options?: RequestInit): Promise<string> => {

  return customFetch<string>(getAppControllerGetHelloUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAppControllerGetHelloQueryKey = () => {
    return [
    `/`
    ] as const;
    }


export const getAppControllerGetHelloQueryOptions = <TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetHelloQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetHello>>> = ({ signal }) => appControllerGetHello({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetHelloQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetHello>>>
export type AppControllerGetHelloQueryError = ErrorType<unknown>


export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHello>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHello>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHello>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHello>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAppControllerGetHello<TData = Awaited<ReturnType<typeof appControllerGetHello>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHello>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAppControllerGetHelloQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAppControllerGetHealthUrl = () => {




  return `/health`
}

/**
 * @summary Uptime pinger buraya vurur; veritabanına dokunmaz.
 */
export const appControllerGetHealth = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAppControllerGetHealthUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAppControllerGetHealthQueryKey = () => {
    return [
    `/health`
    ] as const;
    }


export const getAppControllerGetHealthQueryOptions = <TData = Awaited<ReturnType<typeof appControllerGetHealth>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetHealthQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetHealth>>> = ({ signal }) => appControllerGetHealth({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetHealthQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetHealth>>>
export type AppControllerGetHealthQueryError = ErrorType<unknown>


export function useAppControllerGetHealth<TData = Awaited<ReturnType<typeof appControllerGetHealth>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHealth>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHealth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHealth<TData = Awaited<ReturnType<typeof appControllerGetHealth>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetHealth>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetHealth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetHealth<TData = Awaited<ReturnType<typeof appControllerGetHealth>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Uptime pinger buraya vurur; veritabanına dokunmaz.
 */

export function useAppControllerGetHealth<TData = Awaited<ReturnType<typeof appControllerGetHealth>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetHealth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAppControllerGetHealthQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAppControllerGetDeleteAccountUrl = () => {




  return `/delete-account`
}

export const appControllerGetDeleteAccount = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAppControllerGetDeleteAccountUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAppControllerGetDeleteAccountQueryKey = () => {
    return [
    `/delete-account`
    ] as const;
    }


export const getAppControllerGetDeleteAccountQueryOptions = <TData = Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetDeleteAccountQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>> = ({ signal }) => appControllerGetDeleteAccount({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetDeleteAccountQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>>
export type AppControllerGetDeleteAccountQueryError = ErrorType<unknown>


export function useAppControllerGetDeleteAccount<TData = Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetDeleteAccount>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetDeleteAccount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetDeleteAccount<TData = Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetDeleteAccount>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetDeleteAccount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetDeleteAccount<TData = Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAppControllerGetDeleteAccount<TData = Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetDeleteAccount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAppControllerGetDeleteAccountQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAppControllerGetPrivacyUrl = () => {




  return `/privacy`
}

export const appControllerGetPrivacy = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAppControllerGetPrivacyUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAppControllerGetPrivacyQueryKey = () => {
    return [
    `/privacy`
    ] as const;
    }


export const getAppControllerGetPrivacyQueryOptions = <TData = Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetPrivacyQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof appControllerGetPrivacy>>> = ({ signal }) => appControllerGetPrivacy({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AppControllerGetPrivacyQueryResult = NonNullable<Awaited<ReturnType<typeof appControllerGetPrivacy>>>
export type AppControllerGetPrivacyQueryError = ErrorType<unknown>


export function useAppControllerGetPrivacy<TData = Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetPrivacy>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetPrivacy>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetPrivacy<TData = Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof appControllerGetPrivacy>>,
          TError,
          Awaited<ReturnType<typeof appControllerGetPrivacy>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAppControllerGetPrivacy<TData = Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAppControllerGetPrivacy<TData = Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof appControllerGetPrivacy>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAppControllerGetPrivacyQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerSignupUrl = () => {




  return `/api/signup`
}

/**
 * @summary Kullanıcı kaydı oluştur
 */
export const authControllerSignup = async (signupDto: SignupDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerSignupUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(signupDto)
  }
);}




export const getAuthControllerSignupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext> => {

const mutationKey = ['authControllerSignup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerSignup>>, {data: BodyType<SignupDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerSignup(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerSignupMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerSignup>>>
    export type AuthControllerSignupMutationBody = BodyType<SignupDto>
    export type AuthControllerSignupMutationError = ErrorType<unknown>

    /**
 * @summary Kullanıcı kaydı oluştur
 */
export const useAuthControllerSignup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerSignup>>,
        TError,
        {data: BodyType<SignupDto>},
        TContext
      > => {
      return useMutation(getAuthControllerSignupMutationOptions(options), queryClient);
    }

export const getAuthControllerLoginUrl = () => {




  return `/api/auth/login`
}

/**
 * @summary E-posta ve şifre ile giriş yap
 */
export const authControllerLogin = async (loginDto: LoginDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loginDto)
  }
);}




export const getAuthControllerLoginMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext> => {

const mutationKey = ['authControllerLogin'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerLogin>>, {data: BodyType<LoginDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogin(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLoginMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerLogin>>>
    export type AuthControllerLoginMutationBody = BodyType<LoginDto>
    export type AuthControllerLoginMutationError = ErrorType<unknown>

    /**
 * @summary E-posta ve şifre ile giriş yap
 */
export const useAuthControllerLogin = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerLogin>>,
        TError,
        {data: BodyType<LoginDto>},
        TContext
      > => {
      return useMutation(getAuthControllerLoginMutationOptions(options), queryClient);
    }

export const getAuthControllerGetMeUrl = () => {




  return `/api/auth/me`
}

/**
 * @summary Mevcut oturum açmış kullanıcı profilini getir
 */
export const authControllerGetMe = async ( options?: RequestInit): Promise<MeResponseDto> => {

  return customFetch<MeResponseDto>(getAuthControllerGetMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerGetMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getAuthControllerGetMeQueryOptions = <TData = Awaited<ReturnType<typeof authControllerGetMe>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerGetMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerGetMe>>> = ({ signal }) => authControllerGetMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerGetMeQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerGetMe>>>
export type AuthControllerGetMeQueryError = ErrorType<unknown>


export function useAuthControllerGetMe<TData = Awaited<ReturnType<typeof authControllerGetMe>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGetMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerGetMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGetMe<TData = Awaited<ReturnType<typeof authControllerGetMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGetMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerGetMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGetMe<TData = Awaited<ReturnType<typeof authControllerGetMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Mevcut oturum açmış kullanıcı profilini getir
 */

export function useAuthControllerGetMe<TData = Awaited<ReturnType<typeof authControllerGetMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGetMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerGetMeQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerRefreshUrl = () => {




  return `/api/auth/refresh`
}

/**
 * @summary Yenileme tokenı ile erişim tokenını yenile
 */
export const authControllerRefresh = async (refreshTokenDto: RefreshTokenDto, options?: RequestInit): Promise<TokensResponseDto> => {

  return customFetch<TokensResponseDto>(getAuthControllerRefreshUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(refreshTokenDto)
  }
);}




export const getAuthControllerRefreshMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerRefresh>>, TError,{data: BodyType<RefreshTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerRefresh>>, TError,{data: BodyType<RefreshTokenDto>}, TContext> => {

const mutationKey = ['authControllerRefresh'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerRefresh>>, {data: BodyType<RefreshTokenDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerRefresh(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerRefreshMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerRefresh>>>
    export type AuthControllerRefreshMutationBody = BodyType<RefreshTokenDto>
    export type AuthControllerRefreshMutationError = ErrorType<unknown>

    /**
 * @summary Yenileme tokenı ile erişim tokenını yenile
 */
export const useAuthControllerRefresh = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerRefresh>>, TError,{data: BodyType<RefreshTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerRefresh>>,
        TError,
        {data: BodyType<RefreshTokenDto>},
        TContext
      > => {
      return useMutation(getAuthControllerRefreshMutationOptions(options), queryClient);
    }

export const getAuthControllerLogoutUrl = () => {




  return `/api/auth/logout`
}

/**
 * @summary Oturumu kapat ve tokenı iptal et
 */
export const authControllerLogout = async (refreshTokenDto: RefreshTokenDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAuthControllerLogoutUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(refreshTokenDto)
  }
);}




export const getAuthControllerLogoutMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogout>>, TError,{data: BodyType<RefreshTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerLogout>>, TError,{data: BodyType<RefreshTokenDto>}, TContext> => {

const mutationKey = ['authControllerLogout'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerLogout>>, {data: BodyType<RefreshTokenDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogout(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerLogout>>>
    export type AuthControllerLogoutMutationBody = BodyType<RefreshTokenDto>
    export type AuthControllerLogoutMutationError = ErrorType<unknown>

    /**
 * @summary Oturumu kapat ve tokenı iptal et
 */
export const useAuthControllerLogout = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogout>>, TError,{data: BodyType<RefreshTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerLogout>>,
        TError,
        {data: BodyType<RefreshTokenDto>},
        TContext
      > => {
      return useMutation(getAuthControllerLogoutMutationOptions(options), queryClient);
    }

export const getAuthControllerForgotPasswordUrl = () => {




  return `/api/auth/forgot-password`
}

/**
 * @summary Şifre sıfırlama kodu talep et
 */
export const authControllerForgotPassword = async (forgotPasswordDto: ForgotPasswordDto, options?: RequestInit): Promise<SuccessMessageResponseDto> => {

  return customFetch<SuccessMessageResponseDto>(getAuthControllerForgotPasswordUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(forgotPasswordDto)
  }
);}




export const getAuthControllerForgotPasswordMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerForgotPassword>>, TError,{data: BodyType<ForgotPasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerForgotPassword>>, TError,{data: BodyType<ForgotPasswordDto>}, TContext> => {

const mutationKey = ['authControllerForgotPassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerForgotPassword>>, {data: BodyType<ForgotPasswordDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerForgotPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerForgotPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerForgotPassword>>>
    export type AuthControllerForgotPasswordMutationBody = BodyType<ForgotPasswordDto>
    export type AuthControllerForgotPasswordMutationError = ErrorType<unknown>

    /**
 * @summary Şifre sıfırlama kodu talep et
 */
export const useAuthControllerForgotPassword = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerForgotPassword>>, TError,{data: BodyType<ForgotPasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerForgotPassword>>,
        TError,
        {data: BodyType<ForgotPasswordDto>},
        TContext
      > => {
      return useMutation(getAuthControllerForgotPasswordMutationOptions(options), queryClient);
    }

export const getAuthControllerResetPasswordUrl = () => {




  return `/api/auth/reset-password`
}

/**
 * @summary 6 haneli doğrulama kodu ile yeni şifre belirle
 */
export const authControllerResetPassword = async (resetPasswordDto: ResetPasswordDto, options?: RequestInit): Promise<SuccessMessageResponseDto> => {

  return customFetch<SuccessMessageResponseDto>(getAuthControllerResetPasswordUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(resetPasswordDto)
  }
);}




export const getAuthControllerResetPasswordMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerResetPassword>>, TError,{data: BodyType<ResetPasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerResetPassword>>, TError,{data: BodyType<ResetPasswordDto>}, TContext> => {

const mutationKey = ['authControllerResetPassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerResetPassword>>, {data: BodyType<ResetPasswordDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerResetPassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerResetPassword>>>
    export type AuthControllerResetPasswordMutationBody = BodyType<ResetPasswordDto>
    export type AuthControllerResetPasswordMutationError = ErrorType<unknown>

    /**
 * @summary 6 haneli doğrulama kodu ile yeni şifre belirle
 */
export const useAuthControllerResetPassword = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerResetPassword>>, TError,{data: BodyType<ResetPasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerResetPassword>>,
        TError,
        {data: BodyType<ResetPasswordDto>},
        TContext
      > => {
      return useMutation(getAuthControllerResetPasswordMutationOptions(options), queryClient);
    }

export const getAuthControllerChangePasswordUrl = () => {




  return `/api/auth/change-password`
}

/**
 * @summary Mevcut oturumda şifre değiştir
 */
export const authControllerChangePassword = async (changePasswordDto: ChangePasswordDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAuthControllerChangePasswordUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(changePasswordDto)
  }
);}




export const getAuthControllerChangePasswordMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext> => {

const mutationKey = ['authControllerChangePassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerChangePassword>>, {data: BodyType<ChangePasswordDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerChangePassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerChangePasswordMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerChangePassword>>>
    export type AuthControllerChangePasswordMutationBody = BodyType<ChangePasswordDto>
    export type AuthControllerChangePasswordMutationError = ErrorType<unknown>

    /**
 * @summary Mevcut oturumda şifre değiştir
 */
export const useAuthControllerChangePassword = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerChangePassword>>,
        TError,
        {data: BodyType<ChangePasswordDto>},
        TContext
      > => {
      return useMutation(getAuthControllerChangePasswordMutationOptions(options), queryClient);
    }

export const getAuthControllerDeleteAccountUrl = () => {




  return `/api/auth/account`
}

/**
 * @summary Kullanıcı hesabını ve tüm verilerini kalıcı olarak sil
 */
export const authControllerDeleteAccount = async (deleteAccountDto: DeleteAccountDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAuthControllerDeleteAccountUrl(),
  {
    ...options,
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(deleteAccountDto)
  }
);}




export const getAuthControllerDeleteAccountMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerDeleteAccount>>, TError,{data: BodyType<DeleteAccountDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerDeleteAccount>>, TError,{data: BodyType<DeleteAccountDto>}, TContext> => {

const mutationKey = ['authControllerDeleteAccount'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerDeleteAccount>>, {data: BodyType<DeleteAccountDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerDeleteAccount(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerDeleteAccountMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerDeleteAccount>>>
    export type AuthControllerDeleteAccountMutationBody = BodyType<DeleteAccountDto>
    export type AuthControllerDeleteAccountMutationError = ErrorType<unknown>

    /**
 * @summary Kullanıcı hesabını ve tüm verilerini kalıcı olarak sil
 */
export const useAuthControllerDeleteAccount = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerDeleteAccount>>, TError,{data: BodyType<DeleteAccountDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerDeleteAccount>>,
        TError,
        {data: BodyType<DeleteAccountDto>},
        TContext
      > => {
      return useMutation(getAuthControllerDeleteAccountMutationOptions(options), queryClient);
    }

export const getAuthControllerWebDeleteAccountUrl = () => {




  return `/api/auth/web-delete-account`
}

/**
 * @summary Web üzerinden e-posta ve şifre ile hesap silme işlemini gerçekleştir
 */
export const authControllerWebDeleteAccount = async (webDeleteAccountDto: WebDeleteAccountDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAuthControllerWebDeleteAccountUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(webDeleteAccountDto)
  }
);}




export const getAuthControllerWebDeleteAccountMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerWebDeleteAccount>>, TError,{data: BodyType<WebDeleteAccountDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerWebDeleteAccount>>, TError,{data: BodyType<WebDeleteAccountDto>}, TContext> => {

const mutationKey = ['authControllerWebDeleteAccount'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerWebDeleteAccount>>, {data: BodyType<WebDeleteAccountDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerWebDeleteAccount(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerWebDeleteAccountMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerWebDeleteAccount>>>
    export type AuthControllerWebDeleteAccountMutationBody = BodyType<WebDeleteAccountDto>
    export type AuthControllerWebDeleteAccountMutationError = ErrorType<unknown>

    /**
 * @summary Web üzerinden e-posta ve şifre ile hesap silme işlemini gerçekleştir
 */
export const useAuthControllerWebDeleteAccount = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerWebDeleteAccount>>, TError,{data: BodyType<WebDeleteAccountDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerWebDeleteAccount>>,
        TError,
        {data: BodyType<WebDeleteAccountDto>},
        TContext
      > => {
      return useMutation(getAuthControllerWebDeleteAccountMutationOptions(options), queryClient);
    }

export const getAuthControllerExchangeCodeUrl = () => {




  return `/api/auth/exchange-code`
}

/**
 * @summary OAuth tek kullanımlık kodunu oturum tokenlarına çevir
 */
export const authControllerExchangeCode = async (exchangeCodeDto: ExchangeCodeDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerExchangeCodeUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(exchangeCodeDto)
  }
);}




export const getAuthControllerExchangeCodeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerExchangeCode>>, TError,{data: BodyType<ExchangeCodeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerExchangeCode>>, TError,{data: BodyType<ExchangeCodeDto>}, TContext> => {

const mutationKey = ['authControllerExchangeCode'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerExchangeCode>>, {data: BodyType<ExchangeCodeDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerExchangeCode(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerExchangeCodeMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerExchangeCode>>>
    export type AuthControllerExchangeCodeMutationBody = BodyType<ExchangeCodeDto>
    export type AuthControllerExchangeCodeMutationError = ErrorType<unknown>

    /**
 * @summary OAuth tek kullanımlık kodunu oturum tokenlarına çevir
 */
export const useAuthControllerExchangeCode = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerExchangeCode>>, TError,{data: BodyType<ExchangeCodeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerExchangeCode>>,
        TError,
        {data: BodyType<ExchangeCodeDto>},
        TContext
      > => {
      return useMutation(getAuthControllerExchangeCodeMutationOptions(options), queryClient);
    }

export const getAuthControllerAppleAuthUrl = () => {




  return `/api/auth/apple`
}

/**
 * @summary Sign in with Apple ile giriş / kayıt (iOS & Web)
 */
export const authControllerAppleAuth = async (appleAuthDto: AppleAuthDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerAppleAuthUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(appleAuthDto)
  }
);}




export const getAuthControllerAppleAuthMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerAppleAuth>>, TError,{data: BodyType<AppleAuthDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerAppleAuth>>, TError,{data: BodyType<AppleAuthDto>}, TContext> => {

const mutationKey = ['authControllerAppleAuth'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerAppleAuth>>, {data: BodyType<AppleAuthDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerAppleAuth(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerAppleAuthMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerAppleAuth>>>
    export type AuthControllerAppleAuthMutationBody = BodyType<AppleAuthDto>
    export type AuthControllerAppleAuthMutationError = ErrorType<unknown>

    /**
 * @summary Sign in with Apple ile giriş / kayıt (iOS & Web)
 */
export const useAuthControllerAppleAuth = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerAppleAuth>>, TError,{data: BodyType<AppleAuthDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerAppleAuth>>,
        TError,
        {data: BodyType<AppleAuthDto>},
        TContext
      > => {
      return useMutation(getAuthControllerAppleAuthMutationOptions(options), queryClient);
    }

export const getAuthControllerGoogleAuthUrl = (params: AuthControllerGoogleAuthParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/auth/google?${stringifiedParams}` : `/api/auth/google`
}

export const authControllerGoogleAuth = async (params: AuthControllerGoogleAuthParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAuthControllerGoogleAuthUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerGoogleAuthQueryKey = (params?: AuthControllerGoogleAuthParams,) => {
    return [
    `/api/auth/google`, ...(params ? [params] : [])
    ] as const;
    }


export const getAuthControllerGoogleAuthQueryOptions = <TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerGoogleAuthQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerGoogleAuth>>> = ({ signal }) => authControllerGoogleAuth(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerGoogleAuthQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerGoogleAuth>>>
export type AuthControllerGoogleAuthQueryError = ErrorType<unknown>


export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleAuth>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleAuth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleAuth>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleAuth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerGoogleAuthQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerGoogleCallbackUrl = (params: AuthControllerGoogleCallbackParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/auth/google/callback?${stringifiedParams}` : `/api/auth/google/callback`
}

export const authControllerGoogleCallback = async (params: AuthControllerGoogleCallbackParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAuthControllerGoogleCallbackUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerGoogleCallbackQueryKey = (params?: AuthControllerGoogleCallbackParams,) => {
    return [
    `/api/auth/google/callback`, ...(params ? [params] : [])
    ] as const;
    }


export const getAuthControllerGoogleCallbackQueryOptions = <TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerGoogleCallbackQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerGoogleCallback>>> = ({ signal }) => authControllerGoogleCallback(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerGoogleCallbackQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerGoogleCallback>>>
export type AuthControllerGoogleCallbackQueryError = ErrorType<unknown>


export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleCallback>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleCallback>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleCallback>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleCallback>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerGoogleCallbackQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUsersControllerUpdateProfileUrl = () => {




  return `/api/users/profile`
}

export const usersControllerUpdateProfile = async (updateProfileDto: UpdateProfileDto, options?: RequestInit): Promise<UserProfileResponseDto> => {

  return customFetch<UserProfileResponseDto>(getUsersControllerUpdateProfileUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateProfileDto)
  }
);}




export const getUsersControllerUpdateProfileMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateProfile>>, TError,{data: BodyType<UpdateProfileDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateProfile>>, TError,{data: BodyType<UpdateProfileDto>}, TContext> => {

const mutationKey = ['usersControllerUpdateProfile'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerUpdateProfile>>, {data: BodyType<UpdateProfileDto>}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerUpdateProfile(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerUpdateProfileMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerUpdateProfile>>>
    export type UsersControllerUpdateProfileMutationBody = BodyType<UpdateProfileDto>
    export type UsersControllerUpdateProfileMutationError = ErrorType<unknown>

    export const useUsersControllerUpdateProfile = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateProfile>>, TError,{data: BodyType<UpdateProfileDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerUpdateProfile>>,
        TError,
        {data: BodyType<UpdateProfileDto>},
        TContext
      > => {
      return useMutation(getUsersControllerUpdateProfileMutationOptions(options), queryClient);
    }

export const getUsersControllerSetLanguageUrl = () => {




  return `/api/users/language`
}

export const usersControllerSetLanguage = async (updateLanguageDto: UpdateLanguageDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerSetLanguageUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateLanguageDto)
  }
);}




export const getUsersControllerSetLanguageMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerSetLanguage>>, TError,{data: BodyType<UpdateLanguageDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerSetLanguage>>, TError,{data: BodyType<UpdateLanguageDto>}, TContext> => {

const mutationKey = ['usersControllerSetLanguage'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerSetLanguage>>, {data: BodyType<UpdateLanguageDto>}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerSetLanguage(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerSetLanguageMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerSetLanguage>>>
    export type UsersControllerSetLanguageMutationBody = BodyType<UpdateLanguageDto>
    export type UsersControllerSetLanguageMutationError = ErrorType<unknown>

    export const useUsersControllerSetLanguage = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerSetLanguage>>, TError,{data: BodyType<UpdateLanguageDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerSetLanguage>>,
        TError,
        {data: BodyType<UpdateLanguageDto>},
        TContext
      > => {
      return useMutation(getUsersControllerSetLanguageMutationOptions(options), queryClient);
    }

export const getUsersControllerGetAssessmentUrl = () => {




  return `/api/users/assessment`
}

export const usersControllerGetAssessment = async ( options?: RequestInit): Promise<UsersControllerGetAssessment200> => {

  return customFetch<UsersControllerGetAssessment200>(getUsersControllerGetAssessmentUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUsersControllerGetAssessmentQueryKey = () => {
    return [
    `/api/users/assessment`
    ] as const;
    }


export const getUsersControllerGetAssessmentQueryOptions = <TData = Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerGetAssessmentQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof usersControllerGetAssessment>>> = ({ signal }) => usersControllerGetAssessment({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UsersControllerGetAssessmentQueryResult = NonNullable<Awaited<ReturnType<typeof usersControllerGetAssessment>>>
export type UsersControllerGetAssessmentQueryError = ErrorType<unknown>


export function useUsersControllerGetAssessment<TData = Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetAssessment>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetAssessment>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetAssessment<TData = Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetAssessment>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetAssessment>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetAssessment<TData = Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUsersControllerGetAssessment<TData = Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetAssessment>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUsersControllerGetAssessmentQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUsersControllerSaveAssessmentUrl = () => {




  return `/api/users/assessment`
}

export const usersControllerSaveAssessment = async (saveAssessmentDto: SaveAssessmentDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerSaveAssessmentUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(saveAssessmentDto)
  }
);}




export const getUsersControllerSaveAssessmentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerSaveAssessment>>, TError,{data: BodyType<SaveAssessmentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerSaveAssessment>>, TError,{data: BodyType<SaveAssessmentDto>}, TContext> => {

const mutationKey = ['usersControllerSaveAssessment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerSaveAssessment>>, {data: BodyType<SaveAssessmentDto>}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerSaveAssessment(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerSaveAssessmentMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerSaveAssessment>>>
    export type UsersControllerSaveAssessmentMutationBody = BodyType<SaveAssessmentDto>
    export type UsersControllerSaveAssessmentMutationError = ErrorType<unknown>

    export const useUsersControllerSaveAssessment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerSaveAssessment>>, TError,{data: BodyType<SaveAssessmentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerSaveAssessment>>,
        TError,
        {data: BodyType<SaveAssessmentDto>},
        TContext
      > => {
      return useMutation(getUsersControllerSaveAssessmentMutationOptions(options), queryClient);
    }

export const getUsersControllerGetMemoriesUrl = () => {




  return `/api/users/memories`
}

export const usersControllerGetMemories = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerGetMemoriesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUsersControllerGetMemoriesQueryKey = () => {
    return [
    `/api/users/memories`
    ] as const;
    }


export const getUsersControllerGetMemoriesQueryOptions = <TData = Awaited<ReturnType<typeof usersControllerGetMemories>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerGetMemoriesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof usersControllerGetMemories>>> = ({ signal }) => usersControllerGetMemories({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UsersControllerGetMemoriesQueryResult = NonNullable<Awaited<ReturnType<typeof usersControllerGetMemories>>>
export type UsersControllerGetMemoriesQueryError = ErrorType<unknown>


export function useUsersControllerGetMemories<TData = Awaited<ReturnType<typeof usersControllerGetMemories>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetMemories>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetMemories>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetMemories<TData = Awaited<ReturnType<typeof usersControllerGetMemories>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetMemories>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetMemories>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetMemories<TData = Awaited<ReturnType<typeof usersControllerGetMemories>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUsersControllerGetMemories<TData = Awaited<ReturnType<typeof usersControllerGetMemories>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetMemories>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUsersControllerGetMemoriesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUsersControllerCreateMemoryUrl = () => {




  return `/api/users/memories`
}

export const usersControllerCreateMemory = async (upsertMemoryDto: UpsertMemoryDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerCreateMemoryUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(upsertMemoryDto)
  }
);}




export const getUsersControllerCreateMemoryMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerCreateMemory>>, TError,{data: BodyType<UpsertMemoryDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerCreateMemory>>, TError,{data: BodyType<UpsertMemoryDto>}, TContext> => {

const mutationKey = ['usersControllerCreateMemory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerCreateMemory>>, {data: BodyType<UpsertMemoryDto>}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerCreateMemory(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerCreateMemoryMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerCreateMemory>>>
    export type UsersControllerCreateMemoryMutationBody = BodyType<UpsertMemoryDto>
    export type UsersControllerCreateMemoryMutationError = ErrorType<unknown>

    export const useUsersControllerCreateMemory = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerCreateMemory>>, TError,{data: BodyType<UpsertMemoryDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerCreateMemory>>,
        TError,
        {data: BodyType<UpsertMemoryDto>},
        TContext
      > => {
      return useMutation(getUsersControllerCreateMemoryMutationOptions(options), queryClient);
    }

export const getUsersControllerUpdateMemoryUrl = (memoryId: string,) => {




  return `/api/users/memories/${memoryId}`
}

export const usersControllerUpdateMemory = async (memoryId: string,
    upsertMemoryDto: UpsertMemoryDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerUpdateMemoryUrl(memoryId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(upsertMemoryDto)
  }
);}




export const getUsersControllerUpdateMemoryMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateMemory>>, TError,{memoryId: string;data: BodyType<UpsertMemoryDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateMemory>>, TError,{memoryId: string;data: BodyType<UpsertMemoryDto>}, TContext> => {

const mutationKey = ['usersControllerUpdateMemory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerUpdateMemory>>, {memoryId: string;data: BodyType<UpsertMemoryDto>}> = (props) => {
          const {memoryId,data} = props ?? {};

          return  usersControllerUpdateMemory(memoryId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerUpdateMemoryMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerUpdateMemory>>>
    export type UsersControllerUpdateMemoryMutationBody = BodyType<UpsertMemoryDto>
    export type UsersControllerUpdateMemoryMutationError = ErrorType<unknown>

    export const useUsersControllerUpdateMemory = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateMemory>>, TError,{memoryId: string;data: BodyType<UpsertMemoryDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerUpdateMemory>>,
        TError,
        {memoryId: string;data: BodyType<UpsertMemoryDto>},
        TContext
      > => {
      return useMutation(getUsersControllerUpdateMemoryMutationOptions(options), queryClient);
    }

export const getUsersControllerDeleteMemoryUrl = (memoryId: string,) => {




  return `/api/users/memories/${memoryId}`
}

export const usersControllerDeleteMemory = async (memoryId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerDeleteMemoryUrl(memoryId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getUsersControllerDeleteMemoryMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerDeleteMemory>>, TError,{memoryId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerDeleteMemory>>, TError,{memoryId: string}, TContext> => {

const mutationKey = ['usersControllerDeleteMemory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerDeleteMemory>>, {memoryId: string}> = (props) => {
          const {memoryId} = props ?? {};

          return  usersControllerDeleteMemory(memoryId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerDeleteMemoryMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerDeleteMemory>>>

    export type UsersControllerDeleteMemoryMutationError = ErrorType<unknown>

    export const useUsersControllerDeleteMemory = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerDeleteMemory>>, TError,{memoryId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerDeleteMemory>>,
        TError,
        {memoryId: string},
        TContext
      > => {
      return useMutation(getUsersControllerDeleteMemoryMutationOptions(options), queryClient);
    }

export const getUsersControllerGetDoctorSummaryUrl = () => {




  return `/api/users/doctor-summary`
}

export const usersControllerGetDoctorSummary = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getUsersControllerGetDoctorSummaryUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUsersControllerGetDoctorSummaryQueryKey = () => {
    return [
    `/api/users/doctor-summary`
    ] as const;
    }


export const getUsersControllerGetDoctorSummaryQueryOptions = <TData = Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerGetDoctorSummaryQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>> = ({ signal }) => usersControllerGetDoctorSummary({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UsersControllerGetDoctorSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>>
export type UsersControllerGetDoctorSummaryQueryError = ErrorType<unknown>


export function useUsersControllerGetDoctorSummary<TData = Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetDoctorSummary<TData = Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetDoctorSummary<TData = Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUsersControllerGetDoctorSummary<TData = Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetDoctorSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUsersControllerGetDoctorSummaryQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUsersControllerGetPublicProfileUrl = (userId: string,) => {




  return `/api/users/${userId}/public`
}

export const usersControllerGetPublicProfile = async (userId: string, options?: RequestInit): Promise<PublicUserResponseDto> => {

  return customFetch<PublicUserResponseDto>(getUsersControllerGetPublicProfileUrl(userId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUsersControllerGetPublicProfileQueryKey = (userId: string,) => {
    return [
    `/api/users/${userId}/public`
    ] as const;
    }


export const getUsersControllerGetPublicProfileQueryOptions = <TData = Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError = ErrorType<unknown>>(userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerGetPublicProfileQueryKey(userId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>> = ({ signal }) => usersControllerGetPublicProfile(userId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: userId !== null && userId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UsersControllerGetPublicProfileQueryResult = NonNullable<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>>
export type UsersControllerGetPublicProfileQueryError = ErrorType<unknown>


export function useUsersControllerGetPublicProfile<TData = Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError = ErrorType<unknown>>(
 userId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetPublicProfile>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetPublicProfile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetPublicProfile<TData = Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerGetPublicProfile>>,
          TError,
          Awaited<ReturnType<typeof usersControllerGetPublicProfile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerGetPublicProfile<TData = Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUsersControllerGetPublicProfile<TData = Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerGetPublicProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUsersControllerGetPublicProfileQueryOptions(userId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getMediaControllerGetUrl = (id: string,
    params?: MediaControllerGetParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/media/${id}?${stringifiedParams}` : `/api/media/${id}`
}

export const mediaControllerGet = async (id: string,
    params?: MediaControllerGetParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getMediaControllerGetUrl(id,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getMediaControllerGetQueryKey = (id: string,
    params?: MediaControllerGetParams,) => {
    return [
    `/api/media/${id}`, ...(params ? [params] : [])
    ] as const;
    }


export const getMediaControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof mediaControllerGet>>, TError = ErrorType<unknown>>(id: string,
    params?: MediaControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getMediaControllerGetQueryKey(id,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof mediaControllerGet>>> = ({ signal }) => mediaControllerGet(id,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type MediaControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof mediaControllerGet>>>
export type MediaControllerGetQueryError = ErrorType<unknown>


export function useMediaControllerGet<TData = Awaited<ReturnType<typeof mediaControllerGet>>, TError = ErrorType<unknown>>(
 id: string,
    params: undefined |  MediaControllerGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof mediaControllerGet>>,
          TError,
          Awaited<ReturnType<typeof mediaControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMediaControllerGet<TData = Awaited<ReturnType<typeof mediaControllerGet>>, TError = ErrorType<unknown>>(
 id: string,
    params?: MediaControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof mediaControllerGet>>,
          TError,
          Awaited<ReturnType<typeof mediaControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMediaControllerGet<TData = Awaited<ReturnType<typeof mediaControllerGet>>, TError = ErrorType<unknown>>(
 id: string,
    params?: MediaControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useMediaControllerGet<TData = Awaited<ReturnType<typeof mediaControllerGet>>, TError = ErrorType<unknown>>(
 id: string,
    params?: MediaControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof mediaControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getMediaControllerGetQueryOptions(id,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSettingsControllerGetSettingsUrl = () => {




  return `/api/settings`
}

export const settingsControllerGetSettings = async ( options?: RequestInit): Promise<SettingsResponseDto> => {

  return customFetch<SettingsResponseDto>(getSettingsControllerGetSettingsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSettingsControllerGetSettingsQueryKey = () => {
    return [
    `/api/settings`
    ] as const;
    }


export const getSettingsControllerGetSettingsQueryOptions = <TData = Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSettingsControllerGetSettingsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof settingsControllerGetSettings>>> = ({ signal }) => settingsControllerGetSettings({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SettingsControllerGetSettingsQueryResult = NonNullable<Awaited<ReturnType<typeof settingsControllerGetSettings>>>
export type SettingsControllerGetSettingsQueryError = ErrorType<unknown>


export function useSettingsControllerGetSettings<TData = Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingsControllerGetSettings>>,
          TError,
          Awaited<ReturnType<typeof settingsControllerGetSettings>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSettingsControllerGetSettings<TData = Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingsControllerGetSettings>>,
          TError,
          Awaited<ReturnType<typeof settingsControllerGetSettings>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSettingsControllerGetSettings<TData = Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSettingsControllerGetSettings<TData = Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGetSettings>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSettingsControllerGetSettingsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSettingsControllerUpdateModulesUrl = () => {




  return `/api/settings/modules`
}

export const settingsControllerUpdateModules = async (updateModulesDto: UpdateModulesDto, options?: RequestInit): Promise<ActiveModulesResponseDto> => {

  return customFetch<ActiveModulesResponseDto>(getSettingsControllerUpdateModulesUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateModulesDto)
  }
);}




export const getSettingsControllerUpdateModulesMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateModules>>, TError,{data: BodyType<UpdateModulesDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateModules>>, TError,{data: BodyType<UpdateModulesDto>}, TContext> => {

const mutationKey = ['settingsControllerUpdateModules'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof settingsControllerUpdateModules>>, {data: BodyType<UpdateModulesDto>}> = (props) => {
          const {data} = props ?? {};

          return  settingsControllerUpdateModules(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SettingsControllerUpdateModulesMutationResult = NonNullable<Awaited<ReturnType<typeof settingsControllerUpdateModules>>>
    export type SettingsControllerUpdateModulesMutationBody = BodyType<UpdateModulesDto>
    export type SettingsControllerUpdateModulesMutationError = ErrorType<unknown>

    export const useSettingsControllerUpdateModules = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateModules>>, TError,{data: BodyType<UpdateModulesDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof settingsControllerUpdateModules>>,
        TError,
        {data: BodyType<UpdateModulesDto>},
        TContext
      > => {
      return useMutation(getSettingsControllerUpdateModulesMutationOptions(options), queryClient);
    }

export const getSettingsControllerUpdateNotificationsUrl = () => {




  return `/api/settings/notifications`
}

export const settingsControllerUpdateNotifications = async (updateNotificationsDto: UpdateNotificationsDto, options?: RequestInit): Promise<NotificationSettingsDto> => {

  return customFetch<NotificationSettingsDto>(getSettingsControllerUpdateNotificationsUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateNotificationsDto)
  }
);}




export const getSettingsControllerUpdateNotificationsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>, TError,{data: BodyType<UpdateNotificationsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>, TError,{data: BodyType<UpdateNotificationsDto>}, TContext> => {

const mutationKey = ['settingsControllerUpdateNotifications'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>, {data: BodyType<UpdateNotificationsDto>}> = (props) => {
          const {data} = props ?? {};

          return  settingsControllerUpdateNotifications(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SettingsControllerUpdateNotificationsMutationResult = NonNullable<Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>>
    export type SettingsControllerUpdateNotificationsMutationBody = BodyType<UpdateNotificationsDto>
    export type SettingsControllerUpdateNotificationsMutationError = ErrorType<unknown>

    export const useSettingsControllerUpdateNotifications = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>, TError,{data: BodyType<UpdateNotificationsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof settingsControllerUpdateNotifications>>,
        TError,
        {data: BodyType<UpdateNotificationsDto>},
        TContext
      > => {
      return useMutation(getSettingsControllerUpdateNotificationsMutationOptions(options), queryClient);
    }

export const getSettingsControllerUpdatePrivacyUrl = () => {




  return `/api/settings/privacy`
}

export const settingsControllerUpdatePrivacy = async (updatePrivacyDto: UpdatePrivacyDto, options?: RequestInit): Promise<PrivacySettingsDto> => {

  return customFetch<PrivacySettingsDto>(getSettingsControllerUpdatePrivacyUrl(),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updatePrivacyDto)
  }
);}




export const getSettingsControllerUpdatePrivacyMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>, TError,{data: BodyType<UpdatePrivacyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>, TError,{data: BodyType<UpdatePrivacyDto>}, TContext> => {

const mutationKey = ['settingsControllerUpdatePrivacy'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>, {data: BodyType<UpdatePrivacyDto>}> = (props) => {
          const {data} = props ?? {};

          return  settingsControllerUpdatePrivacy(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SettingsControllerUpdatePrivacyMutationResult = NonNullable<Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>>
    export type SettingsControllerUpdatePrivacyMutationBody = BodyType<UpdatePrivacyDto>
    export type SettingsControllerUpdatePrivacyMutationError = ErrorType<unknown>

    export const useSettingsControllerUpdatePrivacy = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>, TError,{data: BodyType<UpdatePrivacyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof settingsControllerUpdatePrivacy>>,
        TError,
        {data: BodyType<UpdatePrivacyDto>},
        TContext
      > => {
      return useMutation(getSettingsControllerUpdatePrivacyMutationOptions(options), queryClient);
    }

export const getSettingsControllerCompleteSetupUrl = () => {




  return `/api/settings/complete-setup`
}

export const settingsControllerCompleteSetup = async ( options?: RequestInit): Promise<CompleteSetupResponseDto> => {

  return customFetch<CompleteSetupResponseDto>(getSettingsControllerCompleteSetupUrl(),
  {
    ...options,
    method: 'PATCH'


  }
);}




export const getSettingsControllerCompleteSetupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerCompleteSetup>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof settingsControllerCompleteSetup>>, TError,void, TContext> => {

const mutationKey = ['settingsControllerCompleteSetup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof settingsControllerCompleteSetup>>, void> = () => {


          return  settingsControllerCompleteSetup(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SettingsControllerCompleteSetupMutationResult = NonNullable<Awaited<ReturnType<typeof settingsControllerCompleteSetup>>>

    export type SettingsControllerCompleteSetupMutationError = ErrorType<unknown>

    export const useSettingsControllerCompleteSetup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerCompleteSetup>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof settingsControllerCompleteSetup>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getSettingsControllerCompleteSetupMutationOptions(options), queryClient);
    }

export const getPregnancyControllerCreateUrl = () => {




  return `/api/pregnancy`
}

/**
 * @summary Gebelik kaydı oluştur
 */
export const pregnancyControllerCreate = async (createPregnancyDto: CreatePregnancyDto, options?: RequestInit): Promise<CreatePregnancyResponseDto> => {

  return customFetch<CreatePregnancyResponseDto>(getPregnancyControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createPregnancyDto)
  }
);}




export const getPregnancyControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerCreate>>, TError,{data: BodyType<CreatePregnancyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerCreate>>, TError,{data: BodyType<CreatePregnancyDto>}, TContext> => {

const mutationKey = ['pregnancyControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pregnancyControllerCreate>>, {data: BodyType<CreatePregnancyDto>}> = (props) => {
          const {data} = props ?? {};

          return  pregnancyControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PregnancyControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerCreate>>>
    export type PregnancyControllerCreateMutationBody = BodyType<CreatePregnancyDto>
    export type PregnancyControllerCreateMutationError = ErrorType<unknown>

    /**
 * @summary Gebelik kaydı oluştur
 */
export const usePregnancyControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerCreate>>, TError,{data: BodyType<CreatePregnancyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pregnancyControllerCreate>>,
        TError,
        {data: BodyType<CreatePregnancyDto>},
        TContext
      > => {
      return useMutation(getPregnancyControllerCreateMutationOptions(options), queryClient);
    }

export const getPregnancyControllerUpdateUrl = () => {




  return `/api/pregnancy`
}

/**
 * @summary Gebelik kaydı güncelle
 */
export const pregnancyControllerUpdate = async (updatePregnancyDto: UpdatePregnancyDto, options?: RequestInit): Promise<PregnancyResponseDto> => {

  return customFetch<PregnancyResponseDto>(getPregnancyControllerUpdateUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updatePregnancyDto)
  }
);}




export const getPregnancyControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerUpdate>>, TError,{data: BodyType<UpdatePregnancyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerUpdate>>, TError,{data: BodyType<UpdatePregnancyDto>}, TContext> => {

const mutationKey = ['pregnancyControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pregnancyControllerUpdate>>, {data: BodyType<UpdatePregnancyDto>}> = (props) => {
          const {data} = props ?? {};

          return  pregnancyControllerUpdate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PregnancyControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerUpdate>>>
    export type PregnancyControllerUpdateMutationBody = BodyType<UpdatePregnancyDto>
    export type PregnancyControllerUpdateMutationError = ErrorType<unknown>

    /**
 * @summary Gebelik kaydı güncelle
 */
export const usePregnancyControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerUpdate>>, TError,{data: BodyType<UpdatePregnancyDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pregnancyControllerUpdate>>,
        TError,
        {data: BodyType<UpdatePregnancyDto>},
        TContext
      > => {
      return useMutation(getPregnancyControllerUpdateMutationOptions(options), queryClient);
    }

export const getPregnancyControllerGetUrl = () => {




  return `/api/pregnancy`
}

/**
 * @summary Mevcut aktif gebelik detaylarını getir
 */
export const pregnancyControllerGet = async ( options?: RequestInit): Promise<PregnancyResponseDto> => {

  return customFetch<PregnancyResponseDto>(getPregnancyControllerGetUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPregnancyControllerGetQueryKey = () => {
    return [
    `/api/pregnancy`
    ] as const;
    }


export const getPregnancyControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof pregnancyControllerGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPregnancyControllerGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof pregnancyControllerGet>>> = ({ signal }) => pregnancyControllerGet({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PregnancyControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerGet>>>
export type PregnancyControllerGetQueryError = ErrorType<unknown>


export function usePregnancyControllerGet<TData = Awaited<ReturnType<typeof pregnancyControllerGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGet>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGet<TData = Awaited<ReturnType<typeof pregnancyControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGet>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGet<TData = Awaited<ReturnType<typeof pregnancyControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Mevcut aktif gebelik detaylarını getir
 */

export function usePregnancyControllerGet<TData = Awaited<ReturnType<typeof pregnancyControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPregnancyControllerGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPregnancyControllerRemoveUrl = () => {




  return `/api/pregnancy`
}

export const pregnancyControllerRemove = async ( options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getPregnancyControllerRemoveUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getPregnancyControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerRemove>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerRemove>>, TError,void, TContext> => {

const mutationKey = ['pregnancyControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pregnancyControllerRemove>>, void> = () => {


          return  pregnancyControllerRemove(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PregnancyControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerRemove>>>

    export type PregnancyControllerRemoveMutationError = ErrorType<unknown>

    export const usePregnancyControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerRemove>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pregnancyControllerRemove>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getPregnancyControllerRemoveMutationOptions(options), queryClient);
    }

export const getPregnancyControllerSetBabyNameUrl = () => {




  return `/api/pregnancy/baby-name`
}

/**
 * @summary Bebek ismi belirle
 */
export const pregnancyControllerSetBabyName = async (setBabyNameDto: SetBabyNameDto, options?: RequestInit): Promise<PregnancyResponseDto> => {

  return customFetch<PregnancyResponseDto>(getPregnancyControllerSetBabyNameUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(setBabyNameDto)
  }
);}




export const getPregnancyControllerSetBabyNameMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>, TError,{data: BodyType<SetBabyNameDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>, TError,{data: BodyType<SetBabyNameDto>}, TContext> => {

const mutationKey = ['pregnancyControllerSetBabyName'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>, {data: BodyType<SetBabyNameDto>}> = (props) => {
          const {data} = props ?? {};

          return  pregnancyControllerSetBabyName(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PregnancyControllerSetBabyNameMutationResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>>
    export type PregnancyControllerSetBabyNameMutationBody = BodyType<SetBabyNameDto>
    export type PregnancyControllerSetBabyNameMutationError = ErrorType<unknown>

    /**
 * @summary Bebek ismi belirle
 */
export const usePregnancyControllerSetBabyName = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>, TError,{data: BodyType<SetBabyNameDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pregnancyControllerSetBabyName>>,
        TError,
        {data: BodyType<SetBabyNameDto>},
        TContext
      > => {
      return useMutation(getPregnancyControllerSetBabyNameMutationOptions(options), queryClient);
    }

export const getPregnancyControllerGetBabyNamesUrl = (params?: PregnancyControllerGetBabyNamesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/pregnancy/baby-names?${stringifiedParams}` : `/api/pregnancy/baby-names`
}

/**
 * @summary Bebek isimleri listesini getir
 */
export const pregnancyControllerGetBabyNames = async (params?: PregnancyControllerGetBabyNamesParams, options?: RequestInit): Promise<BabyNamesResponseDto> => {

  return customFetch<BabyNamesResponseDto>(getPregnancyControllerGetBabyNamesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPregnancyControllerGetBabyNamesQueryKey = (params?: PregnancyControllerGetBabyNamesParams,) => {
    return [
    `/api/pregnancy/baby-names`, ...(params ? [params] : [])
    ] as const;
    }


export const getPregnancyControllerGetBabyNamesQueryOptions = <TData = Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError = ErrorType<unknown>>(params?: PregnancyControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPregnancyControllerGetBabyNamesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>> = ({ signal }) => pregnancyControllerGetBabyNames(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PregnancyControllerGetBabyNamesQueryResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>>
export type PregnancyControllerGetBabyNamesQueryError = ErrorType<unknown>


export function usePregnancyControllerGetBabyNames<TData = Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params: undefined |  PregnancyControllerGetBabyNamesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetBabyNames<TData = Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params?: PregnancyControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetBabyNames<TData = Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params?: PregnancyControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Bebek isimleri listesini getir
 */

export function usePregnancyControllerGetBabyNames<TData = Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params?: PregnancyControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPregnancyControllerGetBabyNamesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPregnancyControllerPostpartumRemindersUrl = () => {




  return `/api/pregnancy/postpartum/reminders`
}

export const pregnancyControllerPostpartumReminders = async ( options?: RequestInit): Promise<PregnancyControllerPostpartumReminders201> => {

  return customFetch<PregnancyControllerPostpartumReminders201>(getPregnancyControllerPostpartumRemindersUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getPregnancyControllerPostpartumRemindersMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>, TError,void, TContext> => {

const mutationKey = ['pregnancyControllerPostpartumReminders'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>, void> = () => {


          return  pregnancyControllerPostpartumReminders(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PregnancyControllerPostpartumRemindersMutationResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>>

    export type PregnancyControllerPostpartumRemindersMutationError = ErrorType<unknown>

    export const usePregnancyControllerPostpartumReminders = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pregnancyControllerPostpartumReminders>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getPregnancyControllerPostpartumRemindersMutationOptions(options), queryClient);
    }

export const getPregnancyControllerGetAllWeeksUrl = () => {




  return `/api/pregnancy/weeks`
}

export const pregnancyControllerGetAllWeeks = async ( options?: RequestInit): Promise<AllWeeksResponseDto> => {

  return customFetch<AllWeeksResponseDto>(getPregnancyControllerGetAllWeeksUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPregnancyControllerGetAllWeeksQueryKey = () => {
    return [
    `/api/pregnancy/weeks`
    ] as const;
    }


export const getPregnancyControllerGetAllWeeksQueryOptions = <TData = Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPregnancyControllerGetAllWeeksQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>> = ({ signal }) => pregnancyControllerGetAllWeeks({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PregnancyControllerGetAllWeeksQueryResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>>
export type PregnancyControllerGetAllWeeksQueryError = ErrorType<unknown>


export function usePregnancyControllerGetAllWeeks<TData = Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetAllWeeks<TData = Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetAllWeeks<TData = Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePregnancyControllerGetAllWeeks<TData = Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetAllWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPregnancyControllerGetAllWeeksQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPregnancyControllerGetWeekContentUrl = (weekNumber: number,) => {




  return `/api/pregnancy/weeks/${weekNumber}`
}

export const pregnancyControllerGetWeekContent = async (weekNumber: number, options?: RequestInit): Promise<WeekContentResponseDto> => {

  return customFetch<WeekContentResponseDto>(getPregnancyControllerGetWeekContentUrl(weekNumber),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPregnancyControllerGetWeekContentQueryKey = (weekNumber: number,) => {
    return [
    `/api/pregnancy/weeks/${weekNumber}`
    ] as const;
    }


export const getPregnancyControllerGetWeekContentQueryOptions = <TData = Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError = ErrorType<unknown>>(weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPregnancyControllerGetWeekContentQueryKey(weekNumber);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>> = ({ signal }) => pregnancyControllerGetWeekContent(weekNumber, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: weekNumber !== null && weekNumber !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PregnancyControllerGetWeekContentQueryResult = NonNullable<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>>
export type PregnancyControllerGetWeekContentQueryError = ErrorType<unknown>


export function usePregnancyControllerGetWeekContent<TData = Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError = ErrorType<unknown>>(
 weekNumber: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetWeekContent<TData = Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>,
          TError,
          Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePregnancyControllerGetWeekContent<TData = Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePregnancyControllerGetWeekContent<TData = Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof pregnancyControllerGetWeekContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPregnancyControllerGetWeekContentQueryOptions(weekNumber,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPeriodControllerFertilityUrl = () => {




  return `/api/period/fertility`
}

export const periodControllerFertility = async ( options?: RequestInit): Promise<PeriodControllerFertility200> => {

  return customFetch<PeriodControllerFertility200>(getPeriodControllerFertilityUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPeriodControllerFertilityQueryKey = () => {
    return [
    `/api/period/fertility`
    ] as const;
    }


export const getPeriodControllerFertilityQueryOptions = <TData = Awaited<ReturnType<typeof periodControllerFertility>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPeriodControllerFertilityQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof periodControllerFertility>>> = ({ signal }) => periodControllerFertility({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PeriodControllerFertilityQueryResult = NonNullable<Awaited<ReturnType<typeof periodControllerFertility>>>
export type PeriodControllerFertilityQueryError = ErrorType<unknown>


export function usePeriodControllerFertility<TData = Awaited<ReturnType<typeof periodControllerFertility>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerFertility>>,
          TError,
          Awaited<ReturnType<typeof periodControllerFertility>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerFertility<TData = Awaited<ReturnType<typeof periodControllerFertility>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerFertility>>,
          TError,
          Awaited<ReturnType<typeof periodControllerFertility>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerFertility<TData = Awaited<ReturnType<typeof periodControllerFertility>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePeriodControllerFertility<TData = Awaited<ReturnType<typeof periodControllerFertility>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerFertility>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPeriodControllerFertilityQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPeriodControllerSetupUrl = () => {




  return `/api/period/setup`
}

export const periodControllerSetup = async (periodSetupDto: PeriodSetupDto, options?: RequestInit): Promise<PeriodSetupResponseDto> => {

  return customFetch<PeriodSetupResponseDto>(getPeriodControllerSetupUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(periodSetupDto)
  }
);}




export const getPeriodControllerSetupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerSetup>>, TError,{data: BodyType<PeriodSetupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof periodControllerSetup>>, TError,{data: BodyType<PeriodSetupDto>}, TContext> => {

const mutationKey = ['periodControllerSetup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof periodControllerSetup>>, {data: BodyType<PeriodSetupDto>}> = (props) => {
          const {data} = props ?? {};

          return  periodControllerSetup(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PeriodControllerSetupMutationResult = NonNullable<Awaited<ReturnType<typeof periodControllerSetup>>>
    export type PeriodControllerSetupMutationBody = BodyType<PeriodSetupDto>
    export type PeriodControllerSetupMutationError = ErrorType<unknown>

    export const usePeriodControllerSetup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerSetup>>, TError,{data: BodyType<PeriodSetupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof periodControllerSetup>>,
        TError,
        {data: BodyType<PeriodSetupDto>},
        TContext
      > => {
      return useMutation(getPeriodControllerSetupMutationOptions(options), queryClient);
    }

export const getPeriodControllerGetUrl = () => {




  return `/api/period`
}

export const periodControllerGet = async ( options?: RequestInit): Promise<PeriodResponseDto> => {

  return customFetch<PeriodResponseDto>(getPeriodControllerGetUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPeriodControllerGetQueryKey = () => {
    return [
    `/api/period`
    ] as const;
    }


export const getPeriodControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof periodControllerGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPeriodControllerGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof periodControllerGet>>> = ({ signal }) => periodControllerGet({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PeriodControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof periodControllerGet>>>
export type PeriodControllerGetQueryError = ErrorType<unknown>


export function usePeriodControllerGet<TData = Awaited<ReturnType<typeof periodControllerGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerGet>>,
          TError,
          Awaited<ReturnType<typeof periodControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerGet<TData = Awaited<ReturnType<typeof periodControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerGet>>,
          TError,
          Awaited<ReturnType<typeof periodControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerGet<TData = Awaited<ReturnType<typeof periodControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePeriodControllerGet<TData = Awaited<ReturnType<typeof periodControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPeriodControllerGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPeriodControllerLogUrl = () => {




  return `/api/period/log`
}

export const periodControllerLog = async (periodLogDto: PeriodLogDto, options?: RequestInit): Promise<PeriodDayResponseDto> => {

  return customFetch<PeriodDayResponseDto>(getPeriodControllerLogUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(periodLogDto)
  }
);}




export const getPeriodControllerLogMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerLog>>, TError,{data: BodyType<PeriodLogDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof periodControllerLog>>, TError,{data: BodyType<PeriodLogDto>}, TContext> => {

const mutationKey = ['periodControllerLog'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof periodControllerLog>>, {data: BodyType<PeriodLogDto>}> = (props) => {
          const {data} = props ?? {};

          return  periodControllerLog(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PeriodControllerLogMutationResult = NonNullable<Awaited<ReturnType<typeof periodControllerLog>>>
    export type PeriodControllerLogMutationBody = BodyType<PeriodLogDto>
    export type PeriodControllerLogMutationError = ErrorType<unknown>

    export const usePeriodControllerLog = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerLog>>, TError,{data: BodyType<PeriodLogDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof periodControllerLog>>,
        TError,
        {data: BodyType<PeriodLogDto>},
        TContext
      > => {
      return useMutation(getPeriodControllerLogMutationOptions(options), queryClient);
    }

export const getPeriodControllerCalendarUrl = (params?: PeriodControllerCalendarParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/period/calendar?${stringifiedParams}` : `/api/period/calendar`
}

export const periodControllerCalendar = async (params?: PeriodControllerCalendarParams, options?: RequestInit): Promise<CalendarResponseDto> => {

  return customFetch<CalendarResponseDto>(getPeriodControllerCalendarUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPeriodControllerCalendarQueryKey = (params?: PeriodControllerCalendarParams,) => {
    return [
    `/api/period/calendar`, ...(params ? [params] : [])
    ] as const;
    }


export const getPeriodControllerCalendarQueryOptions = <TData = Awaited<ReturnType<typeof periodControllerCalendar>>, TError = ErrorType<unknown>>(params?: PeriodControllerCalendarParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPeriodControllerCalendarQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof periodControllerCalendar>>> = ({ signal }) => periodControllerCalendar(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PeriodControllerCalendarQueryResult = NonNullable<Awaited<ReturnType<typeof periodControllerCalendar>>>
export type PeriodControllerCalendarQueryError = ErrorType<unknown>


export function usePeriodControllerCalendar<TData = Awaited<ReturnType<typeof periodControllerCalendar>>, TError = ErrorType<unknown>>(
 params: undefined |  PeriodControllerCalendarParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerCalendar>>,
          TError,
          Awaited<ReturnType<typeof periodControllerCalendar>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerCalendar<TData = Awaited<ReturnType<typeof periodControllerCalendar>>, TError = ErrorType<unknown>>(
 params?: PeriodControllerCalendarParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerCalendar>>,
          TError,
          Awaited<ReturnType<typeof periodControllerCalendar>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerCalendar<TData = Awaited<ReturnType<typeof periodControllerCalendar>>, TError = ErrorType<unknown>>(
 params?: PeriodControllerCalendarParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePeriodControllerCalendar<TData = Awaited<ReturnType<typeof periodControllerCalendar>>, TError = ErrorType<unknown>>(
 params?: PeriodControllerCalendarParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerCalendar>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPeriodControllerCalendarQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPeriodControllerHistoryUrl = (params: PeriodControllerHistoryParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/period/history?${stringifiedParams}` : `/api/period/history`
}

export const periodControllerHistory = async (params: PeriodControllerHistoryParams, options?: RequestInit): Promise<PeriodHistoryResponseDto> => {

  return customFetch<PeriodHistoryResponseDto>(getPeriodControllerHistoryUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getPeriodControllerHistoryQueryKey = (params?: PeriodControllerHistoryParams,) => {
    return [
    `/api/period/history`, ...(params ? [params] : [])
    ] as const;
    }


export const getPeriodControllerHistoryQueryOptions = <TData = Awaited<ReturnType<typeof periodControllerHistory>>, TError = ErrorType<unknown>>(params: PeriodControllerHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getPeriodControllerHistoryQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof periodControllerHistory>>> = ({ signal }) => periodControllerHistory(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type PeriodControllerHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof periodControllerHistory>>>
export type PeriodControllerHistoryQueryError = ErrorType<unknown>


export function usePeriodControllerHistory<TData = Awaited<ReturnType<typeof periodControllerHistory>>, TError = ErrorType<unknown>>(
 params: PeriodControllerHistoryParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerHistory>>,
          TError,
          Awaited<ReturnType<typeof periodControllerHistory>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerHistory<TData = Awaited<ReturnType<typeof periodControllerHistory>>, TError = ErrorType<unknown>>(
 params: PeriodControllerHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof periodControllerHistory>>,
          TError,
          Awaited<ReturnType<typeof periodControllerHistory>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function usePeriodControllerHistory<TData = Awaited<ReturnType<typeof periodControllerHistory>>, TError = ErrorType<unknown>>(
 params: PeriodControllerHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function usePeriodControllerHistory<TData = Awaited<ReturnType<typeof periodControllerHistory>>, TError = ErrorType<unknown>>(
 params: PeriodControllerHistoryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof periodControllerHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getPeriodControllerHistoryQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPeriodControllerStartUrl = () => {




  return `/api/period/start`
}

export const periodControllerStart = async (startPeriodDto: StartPeriodDto, options?: RequestInit): Promise<StartPeriodResponseDto> => {

  return customFetch<StartPeriodResponseDto>(getPeriodControllerStartUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(startPeriodDto)
  }
);}




export const getPeriodControllerStartMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerStart>>, TError,{data: BodyType<StartPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof periodControllerStart>>, TError,{data: BodyType<StartPeriodDto>}, TContext> => {

const mutationKey = ['periodControllerStart'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof periodControllerStart>>, {data: BodyType<StartPeriodDto>}> = (props) => {
          const {data} = props ?? {};

          return  periodControllerStart(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PeriodControllerStartMutationResult = NonNullable<Awaited<ReturnType<typeof periodControllerStart>>>
    export type PeriodControllerStartMutationBody = BodyType<StartPeriodDto>
    export type PeriodControllerStartMutationError = ErrorType<unknown>

    export const usePeriodControllerStart = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerStart>>, TError,{data: BodyType<StartPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof periodControllerStart>>,
        TError,
        {data: BodyType<StartPeriodDto>},
        TContext
      > => {
      return useMutation(getPeriodControllerStartMutationOptions(options), queryClient);
    }

export const getPeriodControllerEndUrl = () => {




  return `/api/period/end`
}

export const periodControllerEnd = async (endPeriodDto: EndPeriodDto, options?: RequestInit): Promise<EndPeriodResponseDto> => {

  return customFetch<EndPeriodResponseDto>(getPeriodControllerEndUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(endPeriodDto)
  }
);}




export const getPeriodControllerEndMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerEnd>>, TError,{data: BodyType<EndPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof periodControllerEnd>>, TError,{data: BodyType<EndPeriodDto>}, TContext> => {

const mutationKey = ['periodControllerEnd'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof periodControllerEnd>>, {data: BodyType<EndPeriodDto>}> = (props) => {
          const {data} = props ?? {};

          return  periodControllerEnd(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PeriodControllerEndMutationResult = NonNullable<Awaited<ReturnType<typeof periodControllerEnd>>>
    export type PeriodControllerEndMutationBody = BodyType<EndPeriodDto>
    export type PeriodControllerEndMutationError = ErrorType<unknown>

    export const usePeriodControllerEnd = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerEnd>>, TError,{data: BodyType<EndPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof periodControllerEnd>>,
        TError,
        {data: BodyType<EndPeriodDto>},
        TContext
      > => {
      return useMutation(getPeriodControllerEndMutationOptions(options), queryClient);
    }

export const getPeriodControllerEndCycleUrl = (cycleId: string,) => {




  return `/api/period/cycles/${cycleId}/end`
}

export const periodControllerEndCycle = async (cycleId: string,
    endPeriodDto: EndPeriodDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getPeriodControllerEndCycleUrl(cycleId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(endPeriodDto)
  }
);}




export const getPeriodControllerEndCycleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerEndCycle>>, TError,{cycleId: string;data: BodyType<EndPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof periodControllerEndCycle>>, TError,{cycleId: string;data: BodyType<EndPeriodDto>}, TContext> => {

const mutationKey = ['periodControllerEndCycle'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof periodControllerEndCycle>>, {cycleId: string;data: BodyType<EndPeriodDto>}> = (props) => {
          const {cycleId,data} = props ?? {};

          return  periodControllerEndCycle(cycleId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PeriodControllerEndCycleMutationResult = NonNullable<Awaited<ReturnType<typeof periodControllerEndCycle>>>
    export type PeriodControllerEndCycleMutationBody = BodyType<EndPeriodDto>
    export type PeriodControllerEndCycleMutationError = ErrorType<unknown>

    export const usePeriodControllerEndCycle = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof periodControllerEndCycle>>, TError,{cycleId: string;data: BodyType<EndPeriodDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof periodControllerEndCycle>>,
        TError,
        {cycleId: string;data: BodyType<EndPeriodDto>},
        TContext
      > => {
      return useMutation(getPeriodControllerEndCycleMutationOptions(options), queryClient);
    }

export const getSymptomsControllerCreateUrl = () => {




  return `/api/symptoms`
}

export const symptomsControllerCreate = async (createSymptomsDto: CreateSymptomsDto, options?: RequestInit): Promise<SymptomsResponseDto> => {

  return customFetch<SymptomsResponseDto>(getSymptomsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createSymptomsDto)
  }
);}




export const getSymptomsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerCreate>>, TError,{data: BodyType<CreateSymptomsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerCreate>>, TError,{data: BodyType<CreateSymptomsDto>}, TContext> => {

const mutationKey = ['symptomsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof symptomsControllerCreate>>, {data: BodyType<CreateSymptomsDto>}> = (props) => {
          const {data} = props ?? {};

          return  symptomsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SymptomsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof symptomsControllerCreate>>>
    export type SymptomsControllerCreateMutationBody = BodyType<CreateSymptomsDto>
    export type SymptomsControllerCreateMutationError = ErrorType<unknown>

    export const useSymptomsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerCreate>>, TError,{data: BodyType<CreateSymptomsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof symptomsControllerCreate>>,
        TError,
        {data: BodyType<CreateSymptomsDto>},
        TContext
      > => {
      return useMutation(getSymptomsControllerCreateMutationOptions(options), queryClient);
    }

export const getSymptomsControllerGetUrl = (params: SymptomsControllerGetParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/symptoms?${stringifiedParams}` : `/api/symptoms`
}

export const symptomsControllerGet = async (params: SymptomsControllerGetParams, options?: RequestInit): Promise<SymptomsResponseDto> => {

  return customFetch<SymptomsResponseDto>(getSymptomsControllerGetUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSymptomsControllerGetQueryKey = (params?: SymptomsControllerGetParams,) => {
    return [
    `/api/symptoms`, ...(params ? [params] : [])
    ] as const;
    }


export const getSymptomsControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof symptomsControllerGet>>, TError = ErrorType<unknown>>(params: SymptomsControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSymptomsControllerGetQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof symptomsControllerGet>>> = ({ signal }) => symptomsControllerGet(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SymptomsControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof symptomsControllerGet>>>
export type SymptomsControllerGetQueryError = ErrorType<unknown>


export function useSymptomsControllerGet<TData = Awaited<ReturnType<typeof symptomsControllerGet>>, TError = ErrorType<unknown>>(
 params: SymptomsControllerGetParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGet>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGet<TData = Awaited<ReturnType<typeof symptomsControllerGet>>, TError = ErrorType<unknown>>(
 params: SymptomsControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGet>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGet<TData = Awaited<ReturnType<typeof symptomsControllerGet>>, TError = ErrorType<unknown>>(
 params: SymptomsControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSymptomsControllerGet<TData = Awaited<ReturnType<typeof symptomsControllerGet>>, TError = ErrorType<unknown>>(
 params: SymptomsControllerGetParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSymptomsControllerGetQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSymptomsControllerGetHistoryUrl = () => {




  return `/api/symptoms/history`
}

export const symptomsControllerGetHistory = async ( options?: RequestInit): Promise<SymptomHistoryResponseDto> => {

  return customFetch<SymptomHistoryResponseDto>(getSymptomsControllerGetHistoryUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSymptomsControllerGetHistoryQueryKey = () => {
    return [
    `/api/symptoms/history`
    ] as const;
    }


export const getSymptomsControllerGetHistoryQueryOptions = <TData = Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSymptomsControllerGetHistoryQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof symptomsControllerGetHistory>>> = ({ signal }) => symptomsControllerGetHistory({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SymptomsControllerGetHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof symptomsControllerGetHistory>>>
export type SymptomsControllerGetHistoryQueryError = ErrorType<unknown>


export function useSymptomsControllerGetHistory<TData = Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGetHistory>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGetHistory>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGetHistory<TData = Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGetHistory>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGetHistory>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGetHistory<TData = Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSymptomsControllerGetHistory<TData = Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetHistory>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSymptomsControllerGetHistoryQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSymptomsControllerDeleteSymptomUrl = (id: string,) => {




  return `/api/symptoms/${id}`
}

export const symptomsControllerDeleteSymptom = async (id: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getSymptomsControllerDeleteSymptomUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getSymptomsControllerDeleteSymptomMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>, TError,{id: string}, TContext> => {

const mutationKey = ['symptomsControllerDeleteSymptom'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  symptomsControllerDeleteSymptom(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SymptomsControllerDeleteSymptomMutationResult = NonNullable<Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>>

    export type SymptomsControllerDeleteSymptomMutationError = ErrorType<unknown>

    export const useSymptomsControllerDeleteSymptom = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof symptomsControllerDeleteSymptom>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getSymptomsControllerDeleteSymptomMutationOptions(options), queryClient);
    }

export const getSymptomsControllerGetTypesUrl = () => {




  return `/api/symptoms/types`
}

export const symptomsControllerGetTypes = async ( options?: RequestInit): Promise<SymptomTypesResponseDto> => {

  return customFetch<SymptomTypesResponseDto>(getSymptomsControllerGetTypesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSymptomsControllerGetTypesQueryKey = () => {
    return [
    `/api/symptoms/types`
    ] as const;
    }


export const getSymptomsControllerGetTypesQueryOptions = <TData = Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSymptomsControllerGetTypesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof symptomsControllerGetTypes>>> = ({ signal }) => symptomsControllerGetTypes({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SymptomsControllerGetTypesQueryResult = NonNullable<Awaited<ReturnType<typeof symptomsControllerGetTypes>>>
export type SymptomsControllerGetTypesQueryError = ErrorType<unknown>


export function useSymptomsControllerGetTypes<TData = Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGetTypes>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGetTypes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGetTypes<TData = Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof symptomsControllerGetTypes>>,
          TError,
          Awaited<ReturnType<typeof symptomsControllerGetTypes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSymptomsControllerGetTypes<TData = Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSymptomsControllerGetTypes<TData = Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof symptomsControllerGetTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSymptomsControllerGetTypesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerGetPartnerGuideUrl = () => {




  return `/api/relationship/partner-guide`
}

export const relationshipControllerGetPartnerGuide = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerGetPartnerGuideUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerGetPartnerGuideQueryKey = () => {
    return [
    `/api/relationship/partner-guide`
    ] as const;
    }


export const getRelationshipControllerGetPartnerGuideQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerGetPartnerGuideQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>> = ({ signal }) => relationshipControllerGetPartnerGuide({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerGetPartnerGuideQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>>
export type RelationshipControllerGetPartnerGuideQueryError = ErrorType<unknown>


export function useRelationshipControllerGetPartnerGuide<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetPartnerGuide<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetPartnerGuide<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerGetPartnerGuide<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerGuide>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerGetPartnerGuideQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerGetLocationUrl = () => {




  return `/api/relationship/live/location`
}

export const relationshipControllerGetLocation = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerGetLocationUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerGetLocationQueryKey = () => {
    return [
    `/api/relationship/live/location`
    ] as const;
    }


export const getRelationshipControllerGetLocationQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerGetLocationQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerGetLocation>>> = ({ signal }) => relationshipControllerGetLocation({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerGetLocationQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerGetLocation>>>
export type RelationshipControllerGetLocationQueryError = ErrorType<unknown>


export function useRelationshipControllerGetLocation<TData = Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetLocation>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetLocation>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetLocation<TData = Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetLocation>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetLocation>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetLocation<TData = Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerGetLocation<TData = Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetLocation>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerGetLocationQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerUpsertLocationUrl = () => {




  return `/api/relationship/live/location`
}

export const relationshipControllerUpsertLocation = async (locationUpdateDto: LocationUpdateDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerUpsertLocationUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(locationUpdateDto)
  }
);}




export const getRelationshipControllerUpsertLocationMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>, TError,{data: BodyType<LocationUpdateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>, TError,{data: BodyType<LocationUpdateDto>}, TContext> => {

const mutationKey = ['relationshipControllerUpsertLocation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>, {data: BodyType<LocationUpdateDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerUpsertLocation(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerUpsertLocationMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>>
    export type RelationshipControllerUpsertLocationMutationBody = BodyType<LocationUpdateDto>
    export type RelationshipControllerUpsertLocationMutationError = ErrorType<unknown>

    export const useRelationshipControllerUpsertLocation = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>, TError,{data: BodyType<LocationUpdateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerUpsertLocation>>,
        TError,
        {data: BodyType<LocationUpdateDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerUpsertLocationMutationOptions(options), queryClient);
    }

export const getRelationshipControllerListNudgesUrl = () => {




  return `/api/relationship/live/nudges`
}

export const relationshipControllerListNudges = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerListNudgesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerListNudgesQueryKey = () => {
    return [
    `/api/relationship/live/nudges`
    ] as const;
    }


export const getRelationshipControllerListNudgesQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerListNudgesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerListNudges>>> = ({ signal }) => relationshipControllerListNudges({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerListNudgesQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerListNudges>>>
export type RelationshipControllerListNudgesQueryError = ErrorType<unknown>


export function useRelationshipControllerListNudges<TData = Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerListNudges>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerListNudges>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerListNudges<TData = Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerListNudges>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerListNudges>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerListNudges<TData = Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerListNudges<TData = Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListNudges>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerListNudgesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerSendNudgeUrl = () => {




  return `/api/relationship/live/nudges`
}

export const relationshipControllerSendNudge = async (sendNudgeDto: SendNudgeDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerSendNudgeUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(sendNudgeDto)
  }
);}




export const getRelationshipControllerSendNudgeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendNudge>>, TError,{data: BodyType<SendNudgeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendNudge>>, TError,{data: BodyType<SendNudgeDto>}, TContext> => {

const mutationKey = ['relationshipControllerSendNudge'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerSendNudge>>, {data: BodyType<SendNudgeDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerSendNudge(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerSendNudgeMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerSendNudge>>>
    export type RelationshipControllerSendNudgeMutationBody = BodyType<SendNudgeDto>
    export type RelationshipControllerSendNudgeMutationError = ErrorType<unknown>

    export const useRelationshipControllerSendNudge = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendNudge>>, TError,{data: BodyType<SendNudgeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerSendNudge>>,
        TError,
        {data: BodyType<SendNudgeDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerSendNudgeMutationOptions(options), queryClient);
    }

export const getRelationshipControllerTransferNudgeToChatUrl = (nudgeId: string,) => {




  return `/api/relationship/live/nudges/${nudgeId}/to-chat`
}

export const relationshipControllerTransferNudgeToChat = async (nudgeId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerTransferNudgeToChatUrl(nudgeId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getRelationshipControllerTransferNudgeToChatMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>, TError,{nudgeId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>, TError,{nudgeId: string}, TContext> => {

const mutationKey = ['relationshipControllerTransferNudgeToChat'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>, {nudgeId: string}> = (props) => {
          const {nudgeId} = props ?? {};

          return  relationshipControllerTransferNudgeToChat(nudgeId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerTransferNudgeToChatMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>>

    export type RelationshipControllerTransferNudgeToChatMutationError = ErrorType<unknown>

    export const useRelationshipControllerTransferNudgeToChat = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>, TError,{nudgeId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerTransferNudgeToChat>>,
        TError,
        {nudgeId: string},
        TContext
      > => {
      return useMutation(getRelationshipControllerTransferNudgeToChatMutationOptions(options), queryClient);
    }

export const getRelationshipControllerReplyNudgeUrl = (nudgeId: string,) => {




  return `/api/relationship/live/nudges/${nudgeId}/reply`
}

export const relationshipControllerReplyNudge = async (nudgeId: string,
    coupleChatDto: CoupleChatDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerReplyNudgeUrl(nudgeId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(coupleChatDto)
  }
);}




export const getRelationshipControllerReplyNudgeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerReplyNudge>>, TError,{nudgeId: string;data: BodyType<CoupleChatDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerReplyNudge>>, TError,{nudgeId: string;data: BodyType<CoupleChatDto>}, TContext> => {

const mutationKey = ['relationshipControllerReplyNudge'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerReplyNudge>>, {nudgeId: string;data: BodyType<CoupleChatDto>}> = (props) => {
          const {nudgeId,data} = props ?? {};

          return  relationshipControllerReplyNudge(nudgeId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerReplyNudgeMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerReplyNudge>>>
    export type RelationshipControllerReplyNudgeMutationBody = BodyType<CoupleChatDto>
    export type RelationshipControllerReplyNudgeMutationError = ErrorType<unknown>

    export const useRelationshipControllerReplyNudge = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerReplyNudge>>, TError,{nudgeId: string;data: BodyType<CoupleChatDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerReplyNudge>>,
        TError,
        {nudgeId: string;data: BodyType<CoupleChatDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerReplyNudgeMutationOptions(options), queryClient);
    }

export const getRelationshipControllerDeleteNudgeUrl = (nudgeId: string,) => {




  return `/api/relationship/live/nudges/${nudgeId}`
}

export const relationshipControllerDeleteNudge = async (nudgeId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerDeleteNudgeUrl(nudgeId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getRelationshipControllerDeleteNudgeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>, TError,{nudgeId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>, TError,{nudgeId: string}, TContext> => {

const mutationKey = ['relationshipControllerDeleteNudge'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>, {nudgeId: string}> = (props) => {
          const {nudgeId} = props ?? {};

          return  relationshipControllerDeleteNudge(nudgeId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerDeleteNudgeMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>>

    export type RelationshipControllerDeleteNudgeMutationError = ErrorType<unknown>

    export const useRelationshipControllerDeleteNudge = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>, TError,{nudgeId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerDeleteNudge>>,
        TError,
        {nudgeId: string},
        TContext
      > => {
      return useMutation(getRelationshipControllerDeleteNudgeMutationOptions(options), queryClient);
    }

export const getRelationshipControllerListMessagesUrl = (params?: RelationshipControllerListMessagesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/relationship/live/messages?${stringifiedParams}` : `/api/relationship/live/messages`
}

/**
 * @summary Eş sohbet mesajlarını cursor ve sayfalama ile listele
 */
export const relationshipControllerListMessages = async (params?: RelationshipControllerListMessagesParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerListMessagesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerListMessagesQueryKey = (params?: RelationshipControllerListMessagesParams,) => {
    return [
    `/api/relationship/live/messages`, ...(params ? [params] : [])
    ] as const;
    }


export const getRelationshipControllerListMessagesQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError = ErrorType<unknown>>(params?: RelationshipControllerListMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerListMessagesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerListMessages>>> = ({ signal }) => relationshipControllerListMessages(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerListMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerListMessages>>>
export type RelationshipControllerListMessagesQueryError = ErrorType<unknown>


export function useRelationshipControllerListMessages<TData = Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError = ErrorType<unknown>>(
 params: undefined |  RelationshipControllerListMessagesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerListMessages>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerListMessages>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerListMessages<TData = Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError = ErrorType<unknown>>(
 params?: RelationshipControllerListMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerListMessages>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerListMessages>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerListMessages<TData = Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError = ErrorType<unknown>>(
 params?: RelationshipControllerListMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Eş sohbet mesajlarını cursor ve sayfalama ile listele
 */

export function useRelationshipControllerListMessages<TData = Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError = ErrorType<unknown>>(
 params?: RelationshipControllerListMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerListMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerListMessagesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerSendMessageUrl = () => {




  return `/api/relationship/live/messages`
}

export const relationshipControllerSendMessage = async (coupleChatDto: CoupleChatDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerSendMessageUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(coupleChatDto)
  }
);}




export const getRelationshipControllerSendMessageMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendMessage>>, TError,{data: BodyType<CoupleChatDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendMessage>>, TError,{data: BodyType<CoupleChatDto>}, TContext> => {

const mutationKey = ['relationshipControllerSendMessage'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerSendMessage>>, {data: BodyType<CoupleChatDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerSendMessage(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerSendMessageMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerSendMessage>>>
    export type RelationshipControllerSendMessageMutationBody = BodyType<CoupleChatDto>
    export type RelationshipControllerSendMessageMutationError = ErrorType<unknown>

    export const useRelationshipControllerSendMessage = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSendMessage>>, TError,{data: BodyType<CoupleChatDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerSendMessage>>,
        TError,
        {data: BodyType<CoupleChatDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerSendMessageMutationOptions(options), queryClient);
    }

export const getRelationshipControllerGetCoupleQuestionsUrl = () => {




  return `/api/relationship/couple-questions`
}

export const relationshipControllerGetCoupleQuestions = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerGetCoupleQuestionsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerGetCoupleQuestionsQueryKey = () => {
    return [
    `/api/relationship/couple-questions`
    ] as const;
    }


export const getRelationshipControllerGetCoupleQuestionsQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerGetCoupleQuestionsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>> = ({ signal }) => relationshipControllerGetCoupleQuestions({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerGetCoupleQuestionsQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>>
export type RelationshipControllerGetCoupleQuestionsQueryError = ErrorType<unknown>


export function useRelationshipControllerGetCoupleQuestions<TData = Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetCoupleQuestions<TData = Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetCoupleQuestions<TData = Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerGetCoupleQuestions<TData = Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetCoupleQuestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerGetCoupleQuestionsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerSaveCoupleAnswerUrl = (questionId: string,) => {




  return `/api/relationship/couple-questions/${questionId}`
}

export const relationshipControllerSaveCoupleAnswer = async (questionId: string,
    answerCoupleQuestionDto: AnswerCoupleQuestionDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerSaveCoupleAnswerUrl(questionId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(answerCoupleQuestionDto)
  }
);}




export const getRelationshipControllerSaveCoupleAnswerMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>, TError,{questionId: string;data: BodyType<AnswerCoupleQuestionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>, TError,{questionId: string;data: BodyType<AnswerCoupleQuestionDto>}, TContext> => {

const mutationKey = ['relationshipControllerSaveCoupleAnswer'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>, {questionId: string;data: BodyType<AnswerCoupleQuestionDto>}> = (props) => {
          const {questionId,data} = props ?? {};

          return  relationshipControllerSaveCoupleAnswer(questionId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerSaveCoupleAnswerMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>>
    export type RelationshipControllerSaveCoupleAnswerMutationBody = BodyType<AnswerCoupleQuestionDto>
    export type RelationshipControllerSaveCoupleAnswerMutationError = ErrorType<unknown>

    export const useRelationshipControllerSaveCoupleAnswer = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>, TError,{questionId: string;data: BodyType<AnswerCoupleQuestionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerSaveCoupleAnswer>>,
        TError,
        {questionId: string;data: BodyType<AnswerCoupleQuestionDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerSaveCoupleAnswerMutationOptions(options), queryClient);
    }

export const getRelationshipControllerGetPartnerInfoUrl = () => {




  return `/api/relationship/partner-info`
}

export const relationshipControllerGetPartnerInfo = async ( options?: RequestInit): Promise<PartnerInfoDto> => {

  return customFetch<PartnerInfoDto>(getRelationshipControllerGetPartnerInfoUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerGetPartnerInfoQueryKey = () => {
    return [
    `/api/relationship/partner-info`
    ] as const;
    }


export const getRelationshipControllerGetPartnerInfoQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerGetPartnerInfoQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>> = ({ signal }) => relationshipControllerGetPartnerInfo({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerGetPartnerInfoQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>>
export type RelationshipControllerGetPartnerInfoQueryError = ErrorType<unknown>


export function useRelationshipControllerGetPartnerInfo<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetPartnerInfo<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGetPartnerInfo<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerGetPartnerInfo<TData = Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGetPartnerInfo>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerGetPartnerInfoQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerLookupPartnerUrl = () => {




  return `/api/relationship/lookup`
}

export const relationshipControllerLookupPartner = async (pairPartnerDto: PairPartnerDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerLookupPartnerUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(pairPartnerDto)
  }
);}




export const getRelationshipControllerLookupPartnerMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerLookupPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerLookupPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext> => {

const mutationKey = ['relationshipControllerLookupPartner'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerLookupPartner>>, {data: BodyType<PairPartnerDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerLookupPartner(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerLookupPartnerMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerLookupPartner>>>
    export type RelationshipControllerLookupPartnerMutationBody = BodyType<PairPartnerDto>
    export type RelationshipControllerLookupPartnerMutationError = ErrorType<unknown>

    export const useRelationshipControllerLookupPartner = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerLookupPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerLookupPartner>>,
        TError,
        {data: BodyType<PairPartnerDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerLookupPartnerMutationOptions(options), queryClient);
    }

export const getRelationshipControllerPairPartnerUrl = () => {




  return `/api/relationship/pair`
}

export const relationshipControllerPairPartner = async (pairPartnerDto: PairPartnerDto, options?: RequestInit): Promise<PartnerInfoDto> => {

  return customFetch<PartnerInfoDto>(getRelationshipControllerPairPartnerUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(pairPartnerDto)
  }
);}




export const getRelationshipControllerPairPartnerMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerPairPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerPairPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext> => {

const mutationKey = ['relationshipControllerPairPartner'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerPairPartner>>, {data: BodyType<PairPartnerDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerPairPartner(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerPairPartnerMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerPairPartner>>>
    export type RelationshipControllerPairPartnerMutationBody = BodyType<PairPartnerDto>
    export type RelationshipControllerPairPartnerMutationError = ErrorType<unknown>

    export const useRelationshipControllerPairPartner = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerPairPartner>>, TError,{data: BodyType<PairPartnerDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerPairPartner>>,
        TError,
        {data: BodyType<PairPartnerDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerPairPartnerMutationOptions(options), queryClient);
    }

export const getRelationshipControllerUnpairUrl = () => {




  return `/api/relationship/unpair`
}

export const relationshipControllerUnpair = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getRelationshipControllerUnpairUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getRelationshipControllerUnpairMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUnpair>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUnpair>>, TError,void, TContext> => {

const mutationKey = ['relationshipControllerUnpair'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerUnpair>>, void> = () => {


          return  relationshipControllerUnpair(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerUnpairMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerUnpair>>>

    export type RelationshipControllerUnpairMutationError = ErrorType<unknown>

    export const useRelationshipControllerUnpair = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUnpair>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerUnpair>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getRelationshipControllerUnpairMutationOptions(options), queryClient);
    }

export const getRelationshipControllerCreateUrl = () => {




  return `/api/relationship`
}

export const relationshipControllerCreate = async (createRelationshipDto: CreateRelationshipDto, options?: RequestInit): Promise<RelationshipResponseDto> => {

  return customFetch<RelationshipResponseDto>(getRelationshipControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createRelationshipDto)
  }
);}




export const getRelationshipControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerCreate>>, TError,{data: BodyType<CreateRelationshipDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerCreate>>, TError,{data: BodyType<CreateRelationshipDto>}, TContext> => {

const mutationKey = ['relationshipControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerCreate>>, {data: BodyType<CreateRelationshipDto>}> = (props) => {
          const {data} = props ?? {};

          return  relationshipControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerCreate>>>
    export type RelationshipControllerCreateMutationBody = BodyType<CreateRelationshipDto>
    export type RelationshipControllerCreateMutationError = ErrorType<unknown>

    export const useRelationshipControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerCreate>>, TError,{data: BodyType<CreateRelationshipDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerCreate>>,
        TError,
        {data: BodyType<CreateRelationshipDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerCreateMutationOptions(options), queryClient);
    }

export const getRelationshipControllerGetUrl = () => {




  return `/api/relationship`
}

export const relationshipControllerGet = async ( options?: RequestInit): Promise<RelationshipResponseDto> => {

  return customFetch<RelationshipResponseDto>(getRelationshipControllerGetUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getRelationshipControllerGetQueryKey = () => {
    return [
    `/api/relationship`
    ] as const;
    }


export const getRelationshipControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof relationshipControllerGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getRelationshipControllerGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof relationshipControllerGet>>> = ({ signal }) => relationshipControllerGet({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type RelationshipControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerGet>>>
export type RelationshipControllerGetQueryError = ErrorType<unknown>


export function useRelationshipControllerGet<TData = Awaited<ReturnType<typeof relationshipControllerGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGet>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGet<TData = Awaited<ReturnType<typeof relationshipControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof relationshipControllerGet>>,
          TError,
          Awaited<ReturnType<typeof relationshipControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useRelationshipControllerGet<TData = Awaited<ReturnType<typeof relationshipControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useRelationshipControllerGet<TData = Awaited<ReturnType<typeof relationshipControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof relationshipControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getRelationshipControllerGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getRelationshipControllerUpdateUrl = (id: string,) => {




  return `/api/relationship/${id}`
}

export const relationshipControllerUpdate = async (id: string,
    updateRelationshipDto: UpdateRelationshipDto, options?: RequestInit): Promise<RelationshipResponseDto> => {

  return customFetch<RelationshipResponseDto>(getRelationshipControllerUpdateUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateRelationshipDto)
  }
);}




export const getRelationshipControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpdate>>, TError,{id: string;data: BodyType<UpdateRelationshipDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpdate>>, TError,{id: string;data: BodyType<UpdateRelationshipDto>}, TContext> => {

const mutationKey = ['relationshipControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerUpdate>>, {id: string;data: BodyType<UpdateRelationshipDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  relationshipControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerUpdate>>>
    export type RelationshipControllerUpdateMutationBody = BodyType<UpdateRelationshipDto>
    export type RelationshipControllerUpdateMutationError = ErrorType<unknown>

    export const useRelationshipControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerUpdate>>, TError,{id: string;data: BodyType<UpdateRelationshipDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateRelationshipDto>},
        TContext
      > => {
      return useMutation(getRelationshipControllerUpdateMutationOptions(options), queryClient);
    }

export const getRelationshipControllerRemoveUrl = (id: string,) => {




  return `/api/relationship/${id}`
}

export const relationshipControllerRemove = async (id: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getRelationshipControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getRelationshipControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['relationshipControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof relationshipControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  relationshipControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type RelationshipControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof relationshipControllerRemove>>>

    export type RelationshipControllerRemoveMutationError = ErrorType<unknown>

    export const useRelationshipControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof relationshipControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof relationshipControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getRelationshipControllerRemoveMutationOptions(options), queryClient);
    }

export const getSpecialDatesControllerCreateUrl = () => {




  return `/api/special-dates`
}

export const specialDatesControllerCreate = async (createSpecialDateDto: CreateSpecialDateDto, options?: RequestInit): Promise<SpecialDateResponseDto> => {

  return customFetch<SpecialDateResponseDto>(getSpecialDatesControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createSpecialDateDto)
  }
);}




export const getSpecialDatesControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerCreate>>, TError,{data: BodyType<CreateSpecialDateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerCreate>>, TError,{data: BodyType<CreateSpecialDateDto>}, TContext> => {

const mutationKey = ['specialDatesControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof specialDatesControllerCreate>>, {data: BodyType<CreateSpecialDateDto>}> = (props) => {
          const {data} = props ?? {};

          return  specialDatesControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SpecialDatesControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof specialDatesControllerCreate>>>
    export type SpecialDatesControllerCreateMutationBody = BodyType<CreateSpecialDateDto>
    export type SpecialDatesControllerCreateMutationError = ErrorType<unknown>

    export const useSpecialDatesControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerCreate>>, TError,{data: BodyType<CreateSpecialDateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof specialDatesControllerCreate>>,
        TError,
        {data: BodyType<CreateSpecialDateDto>},
        TContext
      > => {
      return useMutation(getSpecialDatesControllerCreateMutationOptions(options), queryClient);
    }

export const getSpecialDatesControllerGetAllUrl = (params: SpecialDatesControllerGetAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/special-dates?${stringifiedParams}` : `/api/special-dates`
}

export const specialDatesControllerGetAll = async (params: SpecialDatesControllerGetAllParams, options?: RequestInit): Promise<SpecialDatesListResponseDto> => {

  return customFetch<SpecialDatesListResponseDto>(getSpecialDatesControllerGetAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSpecialDatesControllerGetAllQueryKey = (params?: SpecialDatesControllerGetAllParams,) => {
    return [
    `/api/special-dates`, ...(params ? [params] : [])
    ] as const;
    }


export const getSpecialDatesControllerGetAllQueryOptions = <TData = Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError = ErrorType<unknown>>(params: SpecialDatesControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSpecialDatesControllerGetAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof specialDatesControllerGetAll>>> = ({ signal }) => specialDatesControllerGetAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SpecialDatesControllerGetAllQueryResult = NonNullable<Awaited<ReturnType<typeof specialDatesControllerGetAll>>>
export type SpecialDatesControllerGetAllQueryError = ErrorType<unknown>


export function useSpecialDatesControllerGetAll<TData = Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError = ErrorType<unknown>>(
 params: SpecialDatesControllerGetAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof specialDatesControllerGetAll>>,
          TError,
          Awaited<ReturnType<typeof specialDatesControllerGetAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSpecialDatesControllerGetAll<TData = Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError = ErrorType<unknown>>(
 params: SpecialDatesControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof specialDatesControllerGetAll>>,
          TError,
          Awaited<ReturnType<typeof specialDatesControllerGetAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSpecialDatesControllerGetAll<TData = Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError = ErrorType<unknown>>(
 params: SpecialDatesControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSpecialDatesControllerGetAll<TData = Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError = ErrorType<unknown>>(
 params: SpecialDatesControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSpecialDatesControllerGetAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSpecialDatesControllerGetByIdUrl = (id: string,) => {




  return `/api/special-dates/${id}`
}

export const specialDatesControllerGetById = async (id: string, options?: RequestInit): Promise<SpecialDateResponseDto> => {

  return customFetch<SpecialDateResponseDto>(getSpecialDatesControllerGetByIdUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSpecialDatesControllerGetByIdQueryKey = (id: string,) => {
    return [
    `/api/special-dates/${id}`
    ] as const;
    }


export const getSpecialDatesControllerGetByIdQueryOptions = <TData = Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSpecialDatesControllerGetByIdQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof specialDatesControllerGetById>>> = ({ signal }) => specialDatesControllerGetById(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SpecialDatesControllerGetByIdQueryResult = NonNullable<Awaited<ReturnType<typeof specialDatesControllerGetById>>>
export type SpecialDatesControllerGetByIdQueryError = ErrorType<unknown>


export function useSpecialDatesControllerGetById<TData = Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof specialDatesControllerGetById>>,
          TError,
          Awaited<ReturnType<typeof specialDatesControllerGetById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSpecialDatesControllerGetById<TData = Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof specialDatesControllerGetById>>,
          TError,
          Awaited<ReturnType<typeof specialDatesControllerGetById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSpecialDatesControllerGetById<TData = Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSpecialDatesControllerGetById<TData = Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof specialDatesControllerGetById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSpecialDatesControllerGetByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSpecialDatesControllerUpdateUrl = (id: string,) => {




  return `/api/special-dates/${id}`
}

export const specialDatesControllerUpdate = async (id: string,
    updateSpecialDateDto: UpdateSpecialDateDto, options?: RequestInit): Promise<SpecialDateResponseDto> => {

  return customFetch<SpecialDateResponseDto>(getSpecialDatesControllerUpdateUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateSpecialDateDto)
  }
);}




export const getSpecialDatesControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSpecialDateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSpecialDateDto>}, TContext> => {

const mutationKey = ['specialDatesControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof specialDatesControllerUpdate>>, {id: string;data: BodyType<UpdateSpecialDateDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  specialDatesControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SpecialDatesControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof specialDatesControllerUpdate>>>
    export type SpecialDatesControllerUpdateMutationBody = BodyType<UpdateSpecialDateDto>
    export type SpecialDatesControllerUpdateMutationError = ErrorType<unknown>

    export const useSpecialDatesControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSpecialDateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof specialDatesControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateSpecialDateDto>},
        TContext
      > => {
      return useMutation(getSpecialDatesControllerUpdateMutationOptions(options), queryClient);
    }

export const getSpecialDatesControllerRemoveUrl = (id: string,) => {




  return `/api/special-dates/${id}`
}

export const specialDatesControllerRemove = async (id: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getSpecialDatesControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getSpecialDatesControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['specialDatesControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof specialDatesControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  specialDatesControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SpecialDatesControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof specialDatesControllerRemove>>>

    export type SpecialDatesControllerRemoveMutationError = ErrorType<unknown>

    export const useSpecialDatesControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof specialDatesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof specialDatesControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getSpecialDatesControllerRemoveMutationOptions(options), queryClient);
    }

export const getCommunityControllerCreatePostUrl = () => {




  return `/api/community/posts`
}

export const communityControllerCreatePost = async (createPostDto: CreatePostDto, options?: RequestInit): Promise<CommunityPostResponseDto> => {

  return customFetch<CommunityPostResponseDto>(getCommunityControllerCreatePostUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createPostDto)
  }
);}




export const getCommunityControllerCreatePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreatePost>>, TError,{data: BodyType<CreatePostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreatePost>>, TError,{data: BodyType<CreatePostDto>}, TContext> => {

const mutationKey = ['communityControllerCreatePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerCreatePost>>, {data: BodyType<CreatePostDto>}> = (props) => {
          const {data} = props ?? {};

          return  communityControllerCreatePost(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerCreatePostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerCreatePost>>>
    export type CommunityControllerCreatePostMutationBody = BodyType<CreatePostDto>
    export type CommunityControllerCreatePostMutationError = ErrorType<unknown>

    export const useCommunityControllerCreatePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreatePost>>, TError,{data: BodyType<CreatePostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerCreatePost>>,
        TError,
        {data: BodyType<CreatePostDto>},
        TContext
      > => {
      return useMutation(getCommunityControllerCreatePostMutationOptions(options), queryClient);
    }

export const getCommunityControllerGetPostsUrl = (params?: CommunityControllerGetPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/posts?${stringifiedParams}` : `/api/community/posts`
}

export const communityControllerGetPosts = async (params?: CommunityControllerGetPostsParams, options?: RequestInit): Promise<PostsListResponseDto> => {

  return customFetch<PostsListResponseDto>(getCommunityControllerGetPostsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetPostsQueryKey = (params?: CommunityControllerGetPostsParams,) => {
    return [
    `/api/community/posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerGetPostsQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetPosts>>, TError = ErrorType<unknown>>(params?: CommunityControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetPostsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetPosts>>> = ({ signal }) => communityControllerGetPosts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetPostsQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetPosts>>>
export type CommunityControllerGetPostsQueryError = ErrorType<unknown>


export function useCommunityControllerGetPosts<TData = Awaited<ReturnType<typeof communityControllerGetPosts>>, TError = ErrorType<unknown>>(
 params: undefined |  CommunityControllerGetPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetPosts<TData = Awaited<ReturnType<typeof communityControllerGetPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetPosts<TData = Awaited<ReturnType<typeof communityControllerGetPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetPosts<TData = Awaited<ReturnType<typeof communityControllerGetPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetPostsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerSearchUsersUrl = (params?: CommunityControllerSearchUsersParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/users/search?${stringifiedParams}` : `/api/community/users/search`
}

export const communityControllerSearchUsers = async (params?: CommunityControllerSearchUsersParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerSearchUsersUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerSearchUsersQueryKey = (params?: CommunityControllerSearchUsersParams,) => {
    return [
    `/api/community/users/search`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerSearchUsersQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError = ErrorType<unknown>>(params?: CommunityControllerSearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerSearchUsersQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerSearchUsers>>> = ({ signal }) => communityControllerSearchUsers(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerSearchUsersQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerSearchUsers>>>
export type CommunityControllerSearchUsersQueryError = ErrorType<unknown>


export function useCommunityControllerSearchUsers<TData = Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError = ErrorType<unknown>>(
 params: undefined |  CommunityControllerSearchUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerSearchUsers>>,
          TError,
          Awaited<ReturnType<typeof communityControllerSearchUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerSearchUsers<TData = Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerSearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerSearchUsers>>,
          TError,
          Awaited<ReturnType<typeof communityControllerSearchUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerSearchUsers<TData = Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerSearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerSearchUsers<TData = Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerSearchUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerSearchUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerSearchUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetUserProfileUrl = (targetUserId: string,) => {




  return `/api/community/users/${targetUserId}/profile`
}

export const communityControllerGetUserProfile = async (targetUserId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetUserProfileUrl(targetUserId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetUserProfileQueryKey = (targetUserId: string,) => {
    return [
    `/api/community/users/${targetUserId}/profile`
    ] as const;
    }


export const getCommunityControllerGetUserProfileQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError = ErrorType<unknown>>(targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetUserProfileQueryKey(targetUserId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetUserProfile>>> = ({ signal }) => communityControllerGetUserProfile(targetUserId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: targetUserId !== null && targetUserId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetUserProfileQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetUserProfile>>>
export type CommunityControllerGetUserProfileQueryError = ErrorType<unknown>


export function useCommunityControllerGetUserProfile<TData = Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError = ErrorType<unknown>>(
 targetUserId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetUserProfile>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetUserProfile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetUserProfile<TData = Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetUserProfile>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetUserProfile>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetUserProfile<TData = Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetUserProfile<TData = Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserProfile>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetUserProfileQueryOptions(targetUserId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetUserPostsUrl = (targetUserId: string,
    params?: CommunityControllerGetUserPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/users/${targetUserId}/posts?${stringifiedParams}` : `/api/community/users/${targetUserId}/posts`
}

export const communityControllerGetUserPosts = async (targetUserId: string,
    params?: CommunityControllerGetUserPostsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetUserPostsUrl(targetUserId,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetUserPostsQueryKey = (targetUserId: string,
    params?: CommunityControllerGetUserPostsParams,) => {
    return [
    `/api/community/users/${targetUserId}/posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerGetUserPostsQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError = ErrorType<unknown>>(targetUserId: string,
    params?: CommunityControllerGetUserPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetUserPostsQueryKey(targetUserId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetUserPosts>>> = ({ signal }) => communityControllerGetUserPosts(targetUserId,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: targetUserId !== null && targetUserId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetUserPostsQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetUserPosts>>>
export type CommunityControllerGetUserPostsQueryError = ErrorType<unknown>


export function useCommunityControllerGetUserPosts<TData = Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError = ErrorType<unknown>>(
 targetUserId: string,
    params: undefined |  CommunityControllerGetUserPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetUserPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetUserPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetUserPosts<TData = Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError = ErrorType<unknown>>(
 targetUserId: string,
    params?: CommunityControllerGetUserPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetUserPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetUserPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetUserPosts<TData = Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError = ErrorType<unknown>>(
 targetUserId: string,
    params?: CommunityControllerGetUserPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetUserPosts<TData = Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError = ErrorType<unknown>>(
 targetUserId: string,
    params?: CommunityControllerGetUserPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetUserPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetUserPostsQueryOptions(targetUserId,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerToggleFollowUrl = (targetUserId: string,) => {




  return `/api/community/users/${targetUserId}/follow`
}

export const communityControllerToggleFollow = async (targetUserId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerToggleFollowUrl(targetUserId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCommunityControllerToggleFollowMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleFollow>>, TError,{targetUserId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleFollow>>, TError,{targetUserId: string}, TContext> => {

const mutationKey = ['communityControllerToggleFollow'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerToggleFollow>>, {targetUserId: string}> = (props) => {
          const {targetUserId} = props ?? {};

          return  communityControllerToggleFollow(targetUserId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerToggleFollowMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerToggleFollow>>>

    export type CommunityControllerToggleFollowMutationError = ErrorType<unknown>

    export const useCommunityControllerToggleFollow = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleFollow>>, TError,{targetUserId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerToggleFollow>>,
        TError,
        {targetUserId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerToggleFollowMutationOptions(options), queryClient);
    }

export const getCommunityControllerGetFollowersUrl = (targetUserId: string,) => {




  return `/api/community/users/${targetUserId}/followers`
}

export const communityControllerGetFollowers = async (targetUserId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetFollowersUrl(targetUserId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetFollowersQueryKey = (targetUserId: string,) => {
    return [
    `/api/community/users/${targetUserId}/followers`
    ] as const;
    }


export const getCommunityControllerGetFollowersQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError = ErrorType<unknown>>(targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetFollowersQueryKey(targetUserId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetFollowers>>> = ({ signal }) => communityControllerGetFollowers(targetUserId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: targetUserId !== null && targetUserId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetFollowersQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetFollowers>>>
export type CommunityControllerGetFollowersQueryError = ErrorType<unknown>


export function useCommunityControllerGetFollowers<TData = Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError = ErrorType<unknown>>(
 targetUserId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetFollowers>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetFollowers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetFollowers<TData = Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetFollowers>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetFollowers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetFollowers<TData = Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetFollowers<TData = Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetFollowersQueryOptions(targetUserId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetFollowingUrl = (targetUserId: string,) => {




  return `/api/community/users/${targetUserId}/following`
}

export const communityControllerGetFollowing = async (targetUserId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetFollowingUrl(targetUserId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetFollowingQueryKey = (targetUserId: string,) => {
    return [
    `/api/community/users/${targetUserId}/following`
    ] as const;
    }


export const getCommunityControllerGetFollowingQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError = ErrorType<unknown>>(targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetFollowingQueryKey(targetUserId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetFollowing>>> = ({ signal }) => communityControllerGetFollowing(targetUserId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: targetUserId !== null && targetUserId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetFollowingQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetFollowing>>>
export type CommunityControllerGetFollowingQueryError = ErrorType<unknown>


export function useCommunityControllerGetFollowing<TData = Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError = ErrorType<unknown>>(
 targetUserId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetFollowing>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetFollowing>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetFollowing<TData = Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetFollowing>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetFollowing>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetFollowing<TData = Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetFollowing<TData = Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError = ErrorType<unknown>>(
 targetUserId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetFollowing>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetFollowingQueryOptions(targetUserId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetMyPostsUrl = (params?: CommunityControllerGetMyPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/my-posts?${stringifiedParams}` : `/api/community/my-posts`
}

export const communityControllerGetMyPosts = async (params?: CommunityControllerGetMyPostsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetMyPostsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetMyPostsQueryKey = (params?: CommunityControllerGetMyPostsParams,) => {
    return [
    `/api/community/my-posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerGetMyPostsQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError = ErrorType<unknown>>(params?: CommunityControllerGetMyPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetMyPostsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetMyPosts>>> = ({ signal }) => communityControllerGetMyPosts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetMyPostsQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetMyPosts>>>
export type CommunityControllerGetMyPostsQueryError = ErrorType<unknown>


export function useCommunityControllerGetMyPosts<TData = Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError = ErrorType<unknown>>(
 params: undefined |  CommunityControllerGetMyPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetMyPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetMyPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetMyPosts<TData = Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetMyPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetMyPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetMyPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetMyPosts<TData = Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetMyPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetMyPosts<TData = Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetMyPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetMyPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetMyPostsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetSavedPostsUrl = (params?: CommunityControllerGetSavedPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/saved-posts?${stringifiedParams}` : `/api/community/saved-posts`
}

export const communityControllerGetSavedPosts = async (params?: CommunityControllerGetSavedPostsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetSavedPostsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetSavedPostsQueryKey = (params?: CommunityControllerGetSavedPostsParams,) => {
    return [
    `/api/community/saved-posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerGetSavedPostsQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError = ErrorType<unknown>>(params?: CommunityControllerGetSavedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetSavedPostsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>> = ({ signal }) => communityControllerGetSavedPosts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetSavedPostsQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>>
export type CommunityControllerGetSavedPostsQueryError = ErrorType<unknown>


export function useCommunityControllerGetSavedPosts<TData = Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError = ErrorType<unknown>>(
 params: undefined |  CommunityControllerGetSavedPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetSavedPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetSavedPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetSavedPosts<TData = Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetSavedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetSavedPosts>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetSavedPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetSavedPosts<TData = Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetSavedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetSavedPosts<TData = Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError = ErrorType<unknown>>(
 params?: CommunityControllerGetSavedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetSavedPostsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerGetSavedArticlesUrl = () => {




  return `/api/community/saved-articles`
}

export const communityControllerGetSavedArticles = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerGetSavedArticlesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetSavedArticlesQueryKey = () => {
    return [
    `/api/community/saved-articles`
    ] as const;
    }


export const getCommunityControllerGetSavedArticlesQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetSavedArticlesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>> = ({ signal }) => communityControllerGetSavedArticles({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetSavedArticlesQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>>
export type CommunityControllerGetSavedArticlesQueryError = ErrorType<unknown>


export function useCommunityControllerGetSavedArticles<TData = Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetSavedArticles>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetSavedArticles>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetSavedArticles<TData = Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetSavedArticles>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetSavedArticles>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetSavedArticles<TData = Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetSavedArticles<TData = Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetSavedArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetSavedArticlesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerToggleSavedArticleUrl = (articleId: string,) => {




  return `/api/community/saved-articles/${articleId}`
}

export const communityControllerToggleSavedArticle = async (articleId: string, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getCommunityControllerToggleSavedArticleUrl(articleId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCommunityControllerToggleSavedArticleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>, TError,{articleId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>, TError,{articleId: string}, TContext> => {

const mutationKey = ['communityControllerToggleSavedArticle'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>, {articleId: string}> = (props) => {
          const {articleId} = props ?? {};

          return  communityControllerToggleSavedArticle(articleId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerToggleSavedArticleMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>>

    export type CommunityControllerToggleSavedArticleMutationError = ErrorType<unknown>

    export const useCommunityControllerToggleSavedArticle = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>, TError,{articleId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerToggleSavedArticle>>,
        TError,
        {articleId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerToggleSavedArticleMutationOptions(options), queryClient);
    }

export const getCommunityControllerGetPostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}`
}

export const communityControllerGetPost = async (postId: string, options?: RequestInit): Promise<CommunityPostResponseDto> => {

  return customFetch<CommunityPostResponseDto>(getCommunityControllerGetPostUrl(postId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetPostQueryKey = (postId: string,) => {
    return [
    `/api/community/posts/${postId}`
    ] as const;
    }


export const getCommunityControllerGetPostQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetPost>>, TError = ErrorType<unknown>>(postId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetPostQueryKey(postId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetPost>>> = ({ signal }) => communityControllerGetPost(postId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: postId !== null && postId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetPostQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetPost>>>
export type CommunityControllerGetPostQueryError = ErrorType<unknown>


export function useCommunityControllerGetPost<TData = Awaited<ReturnType<typeof communityControllerGetPost>>, TError = ErrorType<unknown>>(
 postId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetPost>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetPost>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetPost<TData = Awaited<ReturnType<typeof communityControllerGetPost>>, TError = ErrorType<unknown>>(
 postId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetPost>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetPost>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetPost<TData = Awaited<ReturnType<typeof communityControllerGetPost>>, TError = ErrorType<unknown>>(
 postId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetPost<TData = Awaited<ReturnType<typeof communityControllerGetPost>>, TError = ErrorType<unknown>>(
 postId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetPost>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetPostQueryOptions(postId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerEditPostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}`
}

export const communityControllerEditPost = async (postId: string,
    editPostDto: EditPostDto, options?: RequestInit): Promise<CommunityPostResponseDto> => {

  return customFetch<CommunityPostResponseDto>(getCommunityControllerEditPostUrl(postId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(editPostDto)
  }
);}




export const getCommunityControllerEditPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerEditPost>>, TError,{postId: string;data: BodyType<EditPostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerEditPost>>, TError,{postId: string;data: BodyType<EditPostDto>}, TContext> => {

const mutationKey = ['communityControllerEditPost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerEditPost>>, {postId: string;data: BodyType<EditPostDto>}> = (props) => {
          const {postId,data} = props ?? {};

          return  communityControllerEditPost(postId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerEditPostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerEditPost>>>
    export type CommunityControllerEditPostMutationBody = BodyType<EditPostDto>
    export type CommunityControllerEditPostMutationError = ErrorType<unknown>

    export const useCommunityControllerEditPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerEditPost>>, TError,{postId: string;data: BodyType<EditPostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerEditPost>>,
        TError,
        {postId: string;data: BodyType<EditPostDto>},
        TContext
      > => {
      return useMutation(getCommunityControllerEditPostMutationOptions(options), queryClient);
    }

export const getCommunityControllerDeletePostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}`
}

export const communityControllerDeletePost = async (postId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getCommunityControllerDeletePostUrl(postId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getCommunityControllerDeletePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeletePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeletePost>>, TError,{postId: string}, TContext> => {

const mutationKey = ['communityControllerDeletePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerDeletePost>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  communityControllerDeletePost(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerDeletePostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerDeletePost>>>

    export type CommunityControllerDeletePostMutationError = ErrorType<unknown>

    export const useCommunityControllerDeletePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeletePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerDeletePost>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerDeletePostMutationOptions(options), queryClient);
    }

export const getCommunityControllerLikePostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}/like`
}

export const communityControllerLikePost = async (postId: string, options?: RequestInit): Promise<LikeResponseDto> => {

  return customFetch<LikeResponseDto>(getCommunityControllerLikePostUrl(postId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCommunityControllerLikePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerLikePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerLikePost>>, TError,{postId: string}, TContext> => {

const mutationKey = ['communityControllerLikePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerLikePost>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  communityControllerLikePost(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerLikePostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerLikePost>>>

    export type CommunityControllerLikePostMutationError = ErrorType<unknown>

    export const useCommunityControllerLikePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerLikePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerLikePost>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerLikePostMutationOptions(options), queryClient);
    }

export const getCommunityControllerSavePostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}/save`
}

export const communityControllerSavePost = async (postId: string, options?: RequestInit): Promise<SaveResponseDto> => {

  return customFetch<SaveResponseDto>(getCommunityControllerSavePostUrl(postId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCommunityControllerSavePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerSavePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerSavePost>>, TError,{postId: string}, TContext> => {

const mutationKey = ['communityControllerSavePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerSavePost>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  communityControllerSavePost(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerSavePostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerSavePost>>>

    export type CommunityControllerSavePostMutationError = ErrorType<unknown>

    export const useCommunityControllerSavePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerSavePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerSavePost>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerSavePostMutationOptions(options), queryClient);
    }

export const getCommunityControllerReportPostUrl = (postId: string,) => {




  return `/api/community/posts/${postId}/report`
}

export const communityControllerReportPost = async (postId: string,
    reportPostDto: ReportPostDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getCommunityControllerReportPostUrl(postId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(reportPostDto)
  }
);}




export const getCommunityControllerReportPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerReportPost>>, TError,{postId: string;data: BodyType<ReportPostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerReportPost>>, TError,{postId: string;data: BodyType<ReportPostDto>}, TContext> => {

const mutationKey = ['communityControllerReportPost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerReportPost>>, {postId: string;data: BodyType<ReportPostDto>}> = (props) => {
          const {postId,data} = props ?? {};

          return  communityControllerReportPost(postId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerReportPostMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerReportPost>>>
    export type CommunityControllerReportPostMutationBody = BodyType<ReportPostDto>
    export type CommunityControllerReportPostMutationError = ErrorType<unknown>

    export const useCommunityControllerReportPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerReportPost>>, TError,{postId: string;data: BodyType<ReportPostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerReportPost>>,
        TError,
        {postId: string;data: BodyType<ReportPostDto>},
        TContext
      > => {
      return useMutation(getCommunityControllerReportPostMutationOptions(options), queryClient);
    }

export const getCommunityControllerGetCommentsUrl = (postId: string,
    params: CommunityControllerGetCommentsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/community/posts/${postId}/comments?${stringifiedParams}` : `/api/community/posts/${postId}/comments`
}

export const communityControllerGetComments = async (postId: string,
    params: CommunityControllerGetCommentsParams, options?: RequestInit): Promise<CommentsListResponseDto> => {

  return customFetch<CommentsListResponseDto>(getCommunityControllerGetCommentsUrl(postId,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getCommunityControllerGetCommentsQueryKey = (postId: string,
    params?: CommunityControllerGetCommentsParams,) => {
    return [
    `/api/community/posts/${postId}/comments`, ...(params ? [params] : [])
    ] as const;
    }


export const getCommunityControllerGetCommentsQueryOptions = <TData = Awaited<ReturnType<typeof communityControllerGetComments>>, TError = ErrorType<unknown>>(postId: string,
    params: CommunityControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getCommunityControllerGetCommentsQueryKey(postId,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof communityControllerGetComments>>> = ({ signal }) => communityControllerGetComments(postId,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: postId !== null && postId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type CommunityControllerGetCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof communityControllerGetComments>>>
export type CommunityControllerGetCommentsQueryError = ErrorType<unknown>


export function useCommunityControllerGetComments<TData = Awaited<ReturnType<typeof communityControllerGetComments>>, TError = ErrorType<unknown>>(
 postId: string,
    params: CommunityControllerGetCommentsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetComments>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetComments<TData = Awaited<ReturnType<typeof communityControllerGetComments>>, TError = ErrorType<unknown>>(
 postId: string,
    params: CommunityControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof communityControllerGetComments>>,
          TError,
          Awaited<ReturnType<typeof communityControllerGetComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useCommunityControllerGetComments<TData = Awaited<ReturnType<typeof communityControllerGetComments>>, TError = ErrorType<unknown>>(
 postId: string,
    params: CommunityControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useCommunityControllerGetComments<TData = Awaited<ReturnType<typeof communityControllerGetComments>>, TError = ErrorType<unknown>>(
 postId: string,
    params: CommunityControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof communityControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getCommunityControllerGetCommentsQueryOptions(postId,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getCommunityControllerCreateCommentUrl = (postId: string,) => {




  return `/api/community/posts/${postId}/comments`
}

export const communityControllerCreateComment = async (postId: string,
    createCommentDto: CreateCommentDto, options?: RequestInit): Promise<CommentResponseDto> => {

  return customFetch<CommentResponseDto>(getCommunityControllerCreateCommentUrl(postId),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createCommentDto)
  }
);}




export const getCommunityControllerCreateCommentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreateComment>>, TError,{postId: string;data: BodyType<CreateCommentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreateComment>>, TError,{postId: string;data: BodyType<CreateCommentDto>}, TContext> => {

const mutationKey = ['communityControllerCreateComment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerCreateComment>>, {postId: string;data: BodyType<CreateCommentDto>}> = (props) => {
          const {postId,data} = props ?? {};

          return  communityControllerCreateComment(postId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerCreateCommentMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerCreateComment>>>
    export type CommunityControllerCreateCommentMutationBody = BodyType<CreateCommentDto>
    export type CommunityControllerCreateCommentMutationError = ErrorType<unknown>

    export const useCommunityControllerCreateComment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerCreateComment>>, TError,{postId: string;data: BodyType<CreateCommentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerCreateComment>>,
        TError,
        {postId: string;data: BodyType<CreateCommentDto>},
        TContext
      > => {
      return useMutation(getCommunityControllerCreateCommentMutationOptions(options), queryClient);
    }

export const getCommunityControllerDeleteCommentUrl = (commentId: string,) => {




  return `/api/community/comments/${commentId}`
}

export const communityControllerDeleteComment = async (commentId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getCommunityControllerDeleteCommentUrl(commentId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getCommunityControllerDeleteCommentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeleteComment>>, TError,{commentId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeleteComment>>, TError,{commentId: string}, TContext> => {

const mutationKey = ['communityControllerDeleteComment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerDeleteComment>>, {commentId: string}> = (props) => {
          const {commentId} = props ?? {};

          return  communityControllerDeleteComment(commentId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerDeleteCommentMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerDeleteComment>>>

    export type CommunityControllerDeleteCommentMutationError = ErrorType<unknown>

    export const useCommunityControllerDeleteComment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerDeleteComment>>, TError,{commentId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerDeleteComment>>,
        TError,
        {commentId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerDeleteCommentMutationOptions(options), queryClient);
    }

export const getCommunityControllerBlockUserUrl = (userId: string,) => {




  return `/api/community/block/${userId}`
}

export const communityControllerBlockUser = async (userId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getCommunityControllerBlockUserUrl(userId),
  {
    ...options,
    method: 'POST'


  }
);}




export const getCommunityControllerBlockUserMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerBlockUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerBlockUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['communityControllerBlockUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerBlockUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  communityControllerBlockUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerBlockUserMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerBlockUser>>>

    export type CommunityControllerBlockUserMutationError = ErrorType<unknown>

    export const useCommunityControllerBlockUser = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerBlockUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerBlockUser>>,
        TError,
        {userId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerBlockUserMutationOptions(options), queryClient);
    }

export const getCommunityControllerUnblockUserUrl = (userId: string,) => {




  return `/api/community/block/${userId}`
}

export const communityControllerUnblockUser = async (userId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getCommunityControllerUnblockUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getCommunityControllerUnblockUserMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerUnblockUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof communityControllerUnblockUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['communityControllerUnblockUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof communityControllerUnblockUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  communityControllerUnblockUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type CommunityControllerUnblockUserMutationResult = NonNullable<Awaited<ReturnType<typeof communityControllerUnblockUser>>>

    export type CommunityControllerUnblockUserMutationError = ErrorType<unknown>

    export const useCommunityControllerUnblockUser = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof communityControllerUnblockUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof communityControllerUnblockUser>>,
        TError,
        {userId: string},
        TContext
      > => {
      return useMutation(getCommunityControllerUnblockUserMutationOptions(options), queryClient);
    }

export const getNotificationsControllerGetAllUrl = (params: NotificationsControllerGetAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/notifications?${stringifiedParams}` : `/api/notifications`
}

export const notificationsControllerGetAll = async (params: NotificationsControllerGetAllParams, options?: RequestInit): Promise<NotificationsListResponseDto> => {

  return customFetch<NotificationsListResponseDto>(getNotificationsControllerGetAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getNotificationsControllerGetAllQueryKey = (params?: NotificationsControllerGetAllParams,) => {
    return [
    `/api/notifications`, ...(params ? [params] : [])
    ] as const;
    }


export const getNotificationsControllerGetAllQueryOptions = <TData = Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError = ErrorType<unknown>>(params: NotificationsControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getNotificationsControllerGetAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof notificationsControllerGetAll>>> = ({ signal }) => notificationsControllerGetAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type NotificationsControllerGetAllQueryResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerGetAll>>>
export type NotificationsControllerGetAllQueryError = ErrorType<unknown>


export function useNotificationsControllerGetAll<TData = Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError = ErrorType<unknown>>(
 params: NotificationsControllerGetAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof notificationsControllerGetAll>>,
          TError,
          Awaited<ReturnType<typeof notificationsControllerGetAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useNotificationsControllerGetAll<TData = Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError = ErrorType<unknown>>(
 params: NotificationsControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof notificationsControllerGetAll>>,
          TError,
          Awaited<ReturnType<typeof notificationsControllerGetAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useNotificationsControllerGetAll<TData = Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError = ErrorType<unknown>>(
 params: NotificationsControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useNotificationsControllerGetAll<TData = Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError = ErrorType<unknown>>(
 params: NotificationsControllerGetAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerGetAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getNotificationsControllerGetAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getNotificationsControllerUnreadCountUrl = () => {




  return `/api/notifications/unread-count`
}

export const notificationsControllerUnreadCount = async ( options?: RequestInit): Promise<UnreadCountResponseDto> => {

  return customFetch<UnreadCountResponseDto>(getNotificationsControllerUnreadCountUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getNotificationsControllerUnreadCountQueryKey = () => {
    return [
    `/api/notifications/unread-count`
    ] as const;
    }


export const getNotificationsControllerUnreadCountQueryOptions = <TData = Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getNotificationsControllerUnreadCountQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>> = ({ signal }) => notificationsControllerUnreadCount({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type NotificationsControllerUnreadCountQueryResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>>
export type NotificationsControllerUnreadCountQueryError = ErrorType<unknown>


export function useNotificationsControllerUnreadCount<TData = Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof notificationsControllerUnreadCount>>,
          TError,
          Awaited<ReturnType<typeof notificationsControllerUnreadCount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useNotificationsControllerUnreadCount<TData = Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof notificationsControllerUnreadCount>>,
          TError,
          Awaited<ReturnType<typeof notificationsControllerUnreadCount>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useNotificationsControllerUnreadCount<TData = Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useNotificationsControllerUnreadCount<TData = Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof notificationsControllerUnreadCount>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getNotificationsControllerUnreadCountQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getNotificationsControllerMarkReadUrl = (id: string,) => {




  return `/api/notifications/${id}/read`
}

export const notificationsControllerMarkRead = async (id: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getNotificationsControllerMarkReadUrl(id),
  {
    ...options,
    method: 'PATCH'


  }
);}




export const getNotificationsControllerMarkReadMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkRead>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkRead>>, TError,{id: string}, TContext> => {

const mutationKey = ['notificationsControllerMarkRead'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerMarkRead>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  notificationsControllerMarkRead(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerMarkReadMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerMarkRead>>>

    export type NotificationsControllerMarkReadMutationError = ErrorType<unknown>

    export const useNotificationsControllerMarkRead = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkRead>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerMarkRead>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getNotificationsControllerMarkReadMutationOptions(options), queryClient);
    }

export const getNotificationsControllerMarkAllReadUrl = () => {




  return `/api/notifications/read-all`
}

export const notificationsControllerMarkAllRead = async ( options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getNotificationsControllerMarkAllReadUrl(),
  {
    ...options,
    method: 'PATCH'


  }
);}




export const getNotificationsControllerMarkAllReadMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerMarkAllRead'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>, void> = () => {


          return  notificationsControllerMarkAllRead(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerMarkAllReadMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>>

    export type NotificationsControllerMarkAllReadMutationError = ErrorType<unknown>

    export const useNotificationsControllerMarkAllRead = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerMarkAllRead>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerMarkAllReadMutationOptions(options), queryClient);
    }

export const getNotificationsControllerClearAllUrl = () => {




  return `/api/notifications/clear-all`
}

export const notificationsControllerClearAll = async ( options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getNotificationsControllerClearAllUrl(),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getNotificationsControllerClearAllMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerClearAll>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerClearAll>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerClearAll'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerClearAll>>, void> = () => {


          return  notificationsControllerClearAll(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerClearAllMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerClearAll>>>

    export type NotificationsControllerClearAllMutationError = ErrorType<unknown>

    export const useNotificationsControllerClearAll = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerClearAll>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerClearAll>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerClearAllMutationOptions(options), queryClient);
    }

export const getNotificationsControllerAnswerActionUrl = (id: string,) => {




  return `/api/notifications/${id}/answer`
}

export const notificationsControllerAnswerAction = async (id: string,
    answerActionDto: AnswerActionDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getNotificationsControllerAnswerActionUrl(id),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(answerActionDto)
  }
);}




export const getNotificationsControllerAnswerActionMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerAnswerAction>>, TError,{id: string;data: BodyType<AnswerActionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerAnswerAction>>, TError,{id: string;data: BodyType<AnswerActionDto>}, TContext> => {

const mutationKey = ['notificationsControllerAnswerAction'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerAnswerAction>>, {id: string;data: BodyType<AnswerActionDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  notificationsControllerAnswerAction(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerAnswerActionMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerAnswerAction>>>
    export type NotificationsControllerAnswerActionMutationBody = BodyType<AnswerActionDto>
    export type NotificationsControllerAnswerActionMutationError = ErrorType<unknown>

    export const useNotificationsControllerAnswerAction = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerAnswerAction>>, TError,{id: string;data: BodyType<AnswerActionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerAnswerAction>>,
        TError,
        {id: string;data: BodyType<AnswerActionDto>},
        TContext
      > => {
      return useMutation(getNotificationsControllerAnswerActionMutationOptions(options), queryClient);
    }

export const getNotificationsControllerCronPregnancyTipsUrl = () => {




  return `/api/notifications/cron/pregnancy-tips`
}

export const notificationsControllerCronPregnancyTips = async ( options?: RequestInit): Promise<SendNotificationResponseDto> => {

  return customFetch<SendNotificationResponseDto>(getNotificationsControllerCronPregnancyTipsUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getNotificationsControllerCronPregnancyTipsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerCronPregnancyTips'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>, void> = () => {


          return  notificationsControllerCronPregnancyTips(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerCronPregnancyTipsMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>>

    export type NotificationsControllerCronPregnancyTipsMutationError = ErrorType<unknown>

    export const useNotificationsControllerCronPregnancyTips = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerCronPregnancyTips>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerCronPregnancyTipsMutationOptions(options), queryClient);
    }

export const getNotificationsControllerCronSpecialDateRemindersUrl = () => {




  return `/api/notifications/cron/special-date-reminders`
}

export const notificationsControllerCronSpecialDateReminders = async ( options?: RequestInit): Promise<SendNotificationResponseDto> => {

  return customFetch<SendNotificationResponseDto>(getNotificationsControllerCronSpecialDateRemindersUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getNotificationsControllerCronSpecialDateRemindersMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerCronSpecialDateReminders'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>, void> = () => {


          return  notificationsControllerCronSpecialDateReminders(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerCronSpecialDateRemindersMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>>

    export type NotificationsControllerCronSpecialDateRemindersMutationError = ErrorType<unknown>

    export const useNotificationsControllerCronSpecialDateReminders = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerCronSpecialDateReminders>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerCronSpecialDateRemindersMutationOptions(options), queryClient);
    }

export const getNotificationsControllerCronPeriodRemindersUrl = () => {




  return `/api/notifications/cron/period-reminders`
}

export const notificationsControllerCronPeriodReminders = async ( options?: RequestInit): Promise<SendNotificationResponseDto> => {

  return customFetch<SendNotificationResponseDto>(getNotificationsControllerCronPeriodRemindersUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getNotificationsControllerCronPeriodRemindersMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerCronPeriodReminders'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>, void> = () => {


          return  notificationsControllerCronPeriodReminders(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerCronPeriodRemindersMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>>

    export type NotificationsControllerCronPeriodRemindersMutationError = ErrorType<unknown>

    export const useNotificationsControllerCronPeriodReminders = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerCronPeriodReminders>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerCronPeriodRemindersMutationOptions(options), queryClient);
    }

export const getDashboardControllerGetDashboardUrl = () => {




  return `/api/dashboard`
}

export const dashboardControllerGetDashboard = async ( options?: RequestInit): Promise<DashboardResponseDto> => {

  return customFetch<DashboardResponseDto>(getDashboardControllerGetDashboardUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetDashboardQueryKey = () => {
    return [
    `/api/dashboard`
    ] as const;
    }


export const getDashboardControllerGetDashboardQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetDashboardQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>> = ({ signal }) => dashboardControllerGetDashboard({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>>
export type DashboardControllerGetDashboardQueryError = ErrorType<unknown>


export function useDashboardControllerGetDashboard<TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetDashboard<TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetDashboard>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetDashboard<TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetDashboard<TData = Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetDashboard>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetDashboardQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getDashboardControllerGetInsightsUrl = () => {




  return `/api/dashboard/insights`
}

export const dashboardControllerGetInsights = async ( options?: RequestInit): Promise<InsightsResponseDto> => {

  return customFetch<InsightsResponseDto>(getDashboardControllerGetInsightsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetInsightsQueryKey = () => {
    return [
    `/api/dashboard/insights`
    ] as const;
    }


export const getDashboardControllerGetInsightsQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetInsightsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetInsights>>> = ({ signal }) => dashboardControllerGetInsights({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetInsightsQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetInsights>>>
export type DashboardControllerGetInsightsQueryError = ErrorType<unknown>


export function useDashboardControllerGetInsights<TData = Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetInsights>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetInsights>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetInsights<TData = Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetInsights>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetInsights>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetInsights<TData = Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetInsights<TData = Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetInsights>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetInsightsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetAdminPortalUrl = () => {




  return `/admin-portal`
}

export const adminControllerGetAdminPortal = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetAdminPortalUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetAdminPortalQueryKey = () => {
    return [
    `/admin-portal`
    ] as const;
    }


export const getAdminControllerGetAdminPortalQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetAdminPortalQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>> = ({ signal }) => adminControllerGetAdminPortal({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetAdminPortalQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>>
export type AdminControllerGetAdminPortalQueryError = ErrorType<unknown>


export function useAdminControllerGetAdminPortal<TData = Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetAdminPortal>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetAdminPortal>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetAdminPortal<TData = Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetAdminPortal>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetAdminPortal>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetAdminPortal<TData = Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetAdminPortal<TData = Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetAdminPortal>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetAdminPortalQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetStatsUrl = () => {




  return `/api/admin/stats`
}

export const adminControllerGetStats = async ( options?: RequestInit): Promise<AdminStatsDto> => {

  return customFetch<AdminStatsDto>(getAdminControllerGetStatsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetStatsQueryKey = () => {
    return [
    `/api/admin/stats`
    ] as const;
    }


export const getAdminControllerGetStatsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetStats>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetStatsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetStats>>> = ({ signal }) => adminControllerGetStats({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetStats>>>
export type AdminControllerGetStatsQueryError = ErrorType<unknown>


export function useAdminControllerGetStats<TData = Awaited<ReturnType<typeof adminControllerGetStats>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetStats>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetStats<TData = Awaited<ReturnType<typeof adminControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetStats>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetStats<TData = Awaited<ReturnType<typeof adminControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetStats<TData = Awaited<ReturnType<typeof adminControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetStatsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetUsersUrl = (params: AdminControllerGetUsersParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/users?${stringifiedParams}` : `/api/admin/users`
}

export const adminControllerGetUsers = async (params: AdminControllerGetUsersParams, options?: RequestInit): Promise<AdminUsersListResponseDto> => {

  return customFetch<AdminUsersListResponseDto>(getAdminControllerGetUsersUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetUsersQueryKey = (params?: AdminControllerGetUsersParams,) => {
    return [
    `/api/admin/users`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetUsersQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetUsers>>, TError = ErrorType<unknown>>(params: AdminControllerGetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetUsersQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetUsers>>> = ({ signal }) => adminControllerGetUsers(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetUsers>>>
export type AdminControllerGetUsersQueryError = ErrorType<unknown>


export function useAdminControllerGetUsers<TData = Awaited<ReturnType<typeof adminControllerGetUsers>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetUsers>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetUsers<TData = Awaited<ReturnType<typeof adminControllerGetUsers>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetUsers>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetUsers<TData = Awaited<ReturnType<typeof adminControllerGetUsers>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetUsers<TData = Awaited<ReturnType<typeof adminControllerGetUsers>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUsers>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetDeletedAccountsUrl = (params: AdminControllerGetDeletedAccountsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/deleted-accounts?${stringifiedParams}` : `/api/admin/deleted-accounts`
}

export const adminControllerGetDeletedAccounts = async (params: AdminControllerGetDeletedAccountsParams, options?: RequestInit): Promise<AdminDeletedAccountsResponseDto> => {

  return customFetch<AdminDeletedAccountsResponseDto>(getAdminControllerGetDeletedAccountsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetDeletedAccountsQueryKey = (params?: AdminControllerGetDeletedAccountsParams,) => {
    return [
    `/api/admin/deleted-accounts`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetDeletedAccountsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError = ErrorType<unknown>>(params: AdminControllerGetDeletedAccountsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetDeletedAccountsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>> = ({ signal }) => adminControllerGetDeletedAccounts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetDeletedAccountsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>>
export type AdminControllerGetDeletedAccountsQueryError = ErrorType<unknown>


export function useAdminControllerGetDeletedAccounts<TData = Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetDeletedAccountsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetDeletedAccounts<TData = Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetDeletedAccountsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetDeletedAccounts<TData = Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetDeletedAccountsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetDeletedAccounts<TData = Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetDeletedAccountsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetDeletedAccounts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetDeletedAccountsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetUserDetailUrl = (userId: string,) => {




  return `/api/admin/users/${userId}`
}

export const adminControllerGetUserDetail = async (userId: string, options?: RequestInit): Promise<AdminUserDetailDto> => {

  return customFetch<AdminUserDetailDto>(getAdminControllerGetUserDetailUrl(userId),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetUserDetailQueryKey = (userId: string,) => {
    return [
    `/api/admin/users/${userId}`
    ] as const;
    }


export const getAdminControllerGetUserDetailQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError = ErrorType<unknown>>(userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetUserDetailQueryKey(userId);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetUserDetail>>> = ({ signal }) => adminControllerGetUserDetail(userId, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: userId !== null && userId !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetUserDetailQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetUserDetail>>>
export type AdminControllerGetUserDetailQueryError = ErrorType<unknown>


export function useAdminControllerGetUserDetail<TData = Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError = ErrorType<unknown>>(
 userId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetUserDetail>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetUserDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetUserDetail<TData = Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetUserDetail>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetUserDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetUserDetail<TData = Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetUserDetail<TData = Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError = ErrorType<unknown>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetUserDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetUserDetailQueryOptions(userId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerUpdateUserUrl = (userId: string,) => {




  return `/api/admin/users/${userId}`
}

export const adminControllerUpdateUser = async (userId: string,
    updateAdminUserDto: UpdateAdminUserDto, options?: RequestInit): Promise<AdminUserDetailDto> => {

  return customFetch<AdminUserDetailDto>(getAdminControllerUpdateUserUrl(userId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateAdminUserDto)
  }
);}




export const getAdminControllerUpdateUserMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateUser>>, TError,{userId: string;data: BodyType<UpdateAdminUserDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateUser>>, TError,{userId: string;data: BodyType<UpdateAdminUserDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateUser>>, {userId: string;data: BodyType<UpdateAdminUserDto>}> = (props) => {
          const {userId,data} = props ?? {};

          return  adminControllerUpdateUser(userId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateUser>>>
    export type AdminControllerUpdateUserMutationBody = BodyType<UpdateAdminUserDto>
    export type AdminControllerUpdateUserMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateUser = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateUser>>, TError,{userId: string;data: BodyType<UpdateAdminUserDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateUser>>,
        TError,
        {userId: string;data: BodyType<UpdateAdminUserDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateUserMutationOptions(options), queryClient);
    }

export const getAdminControllerDeleteUserUrl = (userId: string,) => {




  return `/api/admin/users/${userId}`
}

export const adminControllerDeleteUser = async (userId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDeleteUserUrl(userId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDeleteUserMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteUser>>, TError,{userId: string}, TContext> => {

const mutationKey = ['adminControllerDeleteUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDeleteUser>>, {userId: string}> = (props) => {
          const {userId} = props ?? {};

          return  adminControllerDeleteUser(userId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDeleteUser>>>

    export type AdminControllerDeleteUserMutationError = ErrorType<unknown>

    export const useAdminControllerDeleteUser = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteUser>>, TError,{userId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDeleteUser>>,
        TError,
        {userId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDeleteUserMutationOptions(options), queryClient);
    }

export const getAdminControllerUpdateWeekContentUrl = (weekNumber: number,) => {




  return `/api/admin/pregnancy/weeks/${weekNumber}`
}

export const adminControllerUpdateWeekContent = async (weekNumber: number,
    updateWeekContentDto: UpdateWeekContentDto, options?: RequestInit): Promise<UpdatedWeekContentResponseDto> => {

  return customFetch<UpdatedWeekContentResponseDto>(getAdminControllerUpdateWeekContentUrl(weekNumber),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateWeekContentDto)
  }
);}




export const getAdminControllerUpdateWeekContentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>, TError,{weekNumber: number;data: BodyType<UpdateWeekContentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>, TError,{weekNumber: number;data: BodyType<UpdateWeekContentDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateWeekContent'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>, {weekNumber: number;data: BodyType<UpdateWeekContentDto>}> = (props) => {
          const {weekNumber,data} = props ?? {};

          return  adminControllerUpdateWeekContent(weekNumber,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateWeekContentMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>>
    export type AdminControllerUpdateWeekContentMutationBody = BodyType<UpdateWeekContentDto>
    export type AdminControllerUpdateWeekContentMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateWeekContent = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>, TError,{weekNumber: number;data: BodyType<UpdateWeekContentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateWeekContent>>,
        TError,
        {weekNumber: number;data: BodyType<UpdateWeekContentDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateWeekContentMutationOptions(options), queryClient);
    }

export const getAdminControllerSendNotificationUrl = () => {




  return `/api/admin/notifications/send`
}

export const adminControllerSendNotification = async (sendNotificationDto: SendNotificationDto, options?: RequestInit): Promise<SendNotificationResponseDto> => {

  return customFetch<SendNotificationResponseDto>(getAdminControllerSendNotificationUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(sendNotificationDto)
  }
);}




export const getAdminControllerSendNotificationMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerSendNotification>>, TError,{data: BodyType<SendNotificationDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerSendNotification>>, TError,{data: BodyType<SendNotificationDto>}, TContext> => {

const mutationKey = ['adminControllerSendNotification'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerSendNotification>>, {data: BodyType<SendNotificationDto>}> = (props) => {
          const {data} = props ?? {};

          return  adminControllerSendNotification(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerSendNotificationMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerSendNotification>>>
    export type AdminControllerSendNotificationMutationBody = BodyType<SendNotificationDto>
    export type AdminControllerSendNotificationMutationError = ErrorType<unknown>

    export const useAdminControllerSendNotification = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerSendNotification>>, TError,{data: BodyType<SendNotificationDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerSendNotification>>,
        TError,
        {data: BodyType<SendNotificationDto>},
        TContext
      > => {
      return useMutation(getAdminControllerSendNotificationMutationOptions(options), queryClient);
    }

export const getAdminControllerGetPostsUrl = (params: AdminControllerGetPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/posts?${stringifiedParams}` : `/api/admin/posts`
}

export const adminControllerGetPosts = async (params: AdminControllerGetPostsParams, options?: RequestInit): Promise<AdminPostsListResponseDto> => {

  return customFetch<AdminPostsListResponseDto>(getAdminControllerGetPostsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetPostsQueryKey = (params?: AdminControllerGetPostsParams,) => {
    return [
    `/api/admin/posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetPostsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetPosts>>, TError = ErrorType<unknown>>(params: AdminControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetPostsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetPosts>>> = ({ signal }) => adminControllerGetPosts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetPostsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetPosts>>>
export type AdminControllerGetPostsQueryError = ErrorType<unknown>


export function useAdminControllerGetPosts<TData = Awaited<ReturnType<typeof adminControllerGetPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPosts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPosts<TData = Awaited<ReturnType<typeof adminControllerGetPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPosts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPosts<TData = Awaited<ReturnType<typeof adminControllerGetPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetPosts<TData = Awaited<ReturnType<typeof adminControllerGetPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetPostsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerDeletePostUrl = (postId: string,) => {




  return `/api/admin/posts/${postId}`
}

export const adminControllerDeletePost = async (postId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDeletePostUrl(postId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDeletePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeletePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeletePost>>, TError,{postId: string}, TContext> => {

const mutationKey = ['adminControllerDeletePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDeletePost>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  adminControllerDeletePost(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDeletePostMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDeletePost>>>

    export type AdminControllerDeletePostMutationError = ErrorType<unknown>

    export const useAdminControllerDeletePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeletePost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDeletePost>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDeletePostMutationOptions(options), queryClient);
    }

export const getAdminControllerUpdatePostUrl = (postId: string,) => {




  return `/api/admin/posts/${postId}`
}

export const adminControllerUpdatePost = async (postId: string,
    adminUpdatePostDto: AdminUpdatePostDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdatePostUrl(postId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdatePostDto)
  }
);}




export const getAdminControllerUpdatePostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdatePost>>, TError,{postId: string;data: BodyType<AdminUpdatePostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdatePost>>, TError,{postId: string;data: BodyType<AdminUpdatePostDto>}, TContext> => {

const mutationKey = ['adminControllerUpdatePost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdatePost>>, {postId: string;data: BodyType<AdminUpdatePostDto>}> = (props) => {
          const {postId,data} = props ?? {};

          return  adminControllerUpdatePost(postId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdatePostMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdatePost>>>
    export type AdminControllerUpdatePostMutationBody = BodyType<AdminUpdatePostDto>
    export type AdminControllerUpdatePostMutationError = ErrorType<unknown>

    export const useAdminControllerUpdatePost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdatePost>>, TError,{postId: string;data: BodyType<AdminUpdatePostDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdatePost>>,
        TError,
        {postId: string;data: BodyType<AdminUpdatePostDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdatePostMutationOptions(options), queryClient);
    }

export const getAdminControllerGetCommentsUrl = (params: AdminControllerGetCommentsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/comments?${stringifiedParams}` : `/api/admin/comments`
}

export const adminControllerGetComments = async (params: AdminControllerGetCommentsParams, options?: RequestInit): Promise<AdminCommentsListResponseDto> => {

  return customFetch<AdminCommentsListResponseDto>(getAdminControllerGetCommentsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetCommentsQueryKey = (params?: AdminControllerGetCommentsParams,) => {
    return [
    `/api/admin/comments`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetCommentsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetComments>>, TError = ErrorType<unknown>>(params: AdminControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetCommentsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetComments>>> = ({ signal }) => adminControllerGetComments(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetComments>>>
export type AdminControllerGetCommentsQueryError = ErrorType<unknown>


export function useAdminControllerGetComments<TData = Awaited<ReturnType<typeof adminControllerGetComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetCommentsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetComments>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetComments<TData = Awaited<ReturnType<typeof adminControllerGetComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetComments>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetComments<TData = Awaited<ReturnType<typeof adminControllerGetComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetComments<TData = Awaited<ReturnType<typeof adminControllerGetComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetCommentsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerDeleteCommentUrl = (commentId: string,) => {




  return `/api/admin/comments/${commentId}`
}

export const adminControllerDeleteComment = async (commentId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDeleteCommentUrl(commentId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDeleteCommentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteComment>>, TError,{commentId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteComment>>, TError,{commentId: string}, TContext> => {

const mutationKey = ['adminControllerDeleteComment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDeleteComment>>, {commentId: string}> = (props) => {
          const {commentId} = props ?? {};

          return  adminControllerDeleteComment(commentId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDeleteCommentMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDeleteComment>>>

    export type AdminControllerDeleteCommentMutationError = ErrorType<unknown>

    export const useAdminControllerDeleteComment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteComment>>, TError,{commentId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDeleteComment>>,
        TError,
        {commentId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDeleteCommentMutationOptions(options), queryClient);
    }

export const getAdminControllerUpdateCommentUrl = (commentId: string,) => {




  return `/api/admin/comments/${commentId}`
}

export const adminControllerUpdateComment = async (commentId: string,
    adminUpdateCommentDto: AdminUpdateCommentDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdateCommentUrl(commentId),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateCommentDto)
  }
);}




export const getAdminControllerUpdateCommentMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateComment>>, TError,{commentId: string;data: BodyType<AdminUpdateCommentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateComment>>, TError,{commentId: string;data: BodyType<AdminUpdateCommentDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateComment'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateComment>>, {commentId: string;data: BodyType<AdminUpdateCommentDto>}> = (props) => {
          const {commentId,data} = props ?? {};

          return  adminControllerUpdateComment(commentId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateCommentMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateComment>>>
    export type AdminControllerUpdateCommentMutationBody = BodyType<AdminUpdateCommentDto>
    export type AdminControllerUpdateCommentMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateComment = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateComment>>, TError,{commentId: string;data: BodyType<AdminUpdateCommentDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateComment>>,
        TError,
        {commentId: string;data: BodyType<AdminUpdateCommentDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateCommentMutationOptions(options), queryClient);
    }

export const getAdminControllerGetPostsWithCommentsUrl = (params: AdminControllerGetPostsWithCommentsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/posts-with-comments?${stringifiedParams}` : `/api/admin/posts-with-comments`
}

export const adminControllerGetPostsWithComments = async (params: AdminControllerGetPostsWithCommentsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetPostsWithCommentsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetPostsWithCommentsQueryKey = (params?: AdminControllerGetPostsWithCommentsParams,) => {
    return [
    `/api/admin/posts-with-comments`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetPostsWithCommentsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError = ErrorType<unknown>>(params: AdminControllerGetPostsWithCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetPostsWithCommentsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>> = ({ signal }) => adminControllerGetPostsWithComments(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetPostsWithCommentsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>>
export type AdminControllerGetPostsWithCommentsQueryError = ErrorType<unknown>


export function useAdminControllerGetPostsWithComments<TData = Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsWithCommentsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPostsWithComments<TData = Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsWithCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPostsWithComments<TData = Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsWithCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetPostsWithComments<TData = Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetPostsWithCommentsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPostsWithComments>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetPostsWithCommentsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetPregnancyWeeksUrl = () => {




  return `/api/admin/content/pregnancy-weeks`
}

export const adminControllerGetPregnancyWeeks = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetPregnancyWeeksUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetPregnancyWeeksQueryKey = () => {
    return [
    `/api/admin/content/pregnancy-weeks`
    ] as const;
    }


export const getAdminControllerGetPregnancyWeeksQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetPregnancyWeeksQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>> = ({ signal }) => adminControllerGetPregnancyWeeks({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetPregnancyWeeksQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>>
export type AdminControllerGetPregnancyWeeksQueryError = ErrorType<unknown>


export function useAdminControllerGetPregnancyWeeks<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPregnancyWeeks<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPregnancyWeeks<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetPregnancyWeeks<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeeks>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetPregnancyWeeksQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetPregnancyWeekDetailUrl = (weekNumber: number,) => {




  return `/api/admin/content/pregnancy-weeks/${weekNumber}`
}

export const adminControllerGetPregnancyWeekDetail = async (weekNumber: number, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetPregnancyWeekDetailUrl(weekNumber),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetPregnancyWeekDetailQueryKey = (weekNumber: number,) => {
    return [
    `/api/admin/content/pregnancy-weeks/${weekNumber}`
    ] as const;
    }


export const getAdminControllerGetPregnancyWeekDetailQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError = ErrorType<unknown>>(weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetPregnancyWeekDetailQueryKey(weekNumber);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>> = ({ signal }) => adminControllerGetPregnancyWeekDetail(weekNumber, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: weekNumber !== null && weekNumber !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetPregnancyWeekDetailQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>>
export type AdminControllerGetPregnancyWeekDetailQueryError = ErrorType<unknown>


export function useAdminControllerGetPregnancyWeekDetail<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError = ErrorType<unknown>>(
 weekNumber: number, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPregnancyWeekDetail<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetPregnancyWeekDetail<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetPregnancyWeekDetail<TData = Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError = ErrorType<unknown>>(
 weekNumber: number, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetPregnancyWeekDetail>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetPregnancyWeekDetailQueryOptions(weekNumber,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerGetSymptomTypesUrl = () => {




  return `/api/admin/content/symptom-types`
}

export const adminControllerGetSymptomTypes = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetSymptomTypesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetSymptomTypesQueryKey = () => {
    return [
    `/api/admin/content/symptom-types`
    ] as const;
    }


export const getAdminControllerGetSymptomTypesQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetSymptomTypesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>> = ({ signal }) => adminControllerGetSymptomTypes({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetSymptomTypesQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>>
export type AdminControllerGetSymptomTypesQueryError = ErrorType<unknown>


export function useAdminControllerGetSymptomTypes<TData = Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetSymptomTypes<TData = Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetSymptomTypes<TData = Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetSymptomTypes<TData = Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetSymptomTypes>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetSymptomTypesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerUpdateSymptomTypeUrl = (id: string,) => {




  return `/api/admin/content/symptom-types/${id}`
}

export const adminControllerUpdateSymptomType = async (id: string,
    adminUpdateSymptomTypeDto: AdminUpdateSymptomTypeDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdateSymptomTypeUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateSymptomTypeDto)
  }
);}




export const getAdminControllerUpdateSymptomTypeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>, TError,{id: string;data: BodyType<AdminUpdateSymptomTypeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>, TError,{id: string;data: BodyType<AdminUpdateSymptomTypeDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateSymptomType'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>, {id: string;data: BodyType<AdminUpdateSymptomTypeDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  adminControllerUpdateSymptomType(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateSymptomTypeMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>>
    export type AdminControllerUpdateSymptomTypeMutationBody = BodyType<AdminUpdateSymptomTypeDto>
    export type AdminControllerUpdateSymptomTypeMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateSymptomType = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>, TError,{id: string;data: BodyType<AdminUpdateSymptomTypeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateSymptomType>>,
        TError,
        {id: string;data: BodyType<AdminUpdateSymptomTypeDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateSymptomTypeMutationOptions(options), queryClient);
    }

export const getAdminControllerGetBabyNamesUrl = (params: AdminControllerGetBabyNamesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/content/baby-names?${stringifiedParams}` : `/api/admin/content/baby-names`
}

export const adminControllerGetBabyNames = async (params: AdminControllerGetBabyNamesParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetBabyNamesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetBabyNamesQueryKey = (params?: AdminControllerGetBabyNamesParams,) => {
    return [
    `/api/admin/content/baby-names`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetBabyNamesQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError = ErrorType<unknown>>(params: AdminControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetBabyNamesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetBabyNames>>> = ({ signal }) => adminControllerGetBabyNames(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetBabyNamesQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetBabyNames>>>
export type AdminControllerGetBabyNamesQueryError = ErrorType<unknown>


export function useAdminControllerGetBabyNames<TData = Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetBabyNamesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetBabyNames>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetBabyNames>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetBabyNames<TData = Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetBabyNames>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetBabyNames>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetBabyNames<TData = Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetBabyNames<TData = Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetBabyNamesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetBabyNames>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetBabyNamesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerUpdateBabyNameUrl = (id: string,) => {




  return `/api/admin/content/baby-names/${id}`
}

export const adminControllerUpdateBabyName = async (id: string,
    adminUpdateBabyNameDto: AdminUpdateBabyNameDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdateBabyNameUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateBabyNameDto)
  }
);}




export const getAdminControllerUpdateBabyNameMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateBabyName>>, TError,{id: string;data: BodyType<AdminUpdateBabyNameDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateBabyName>>, TError,{id: string;data: BodyType<AdminUpdateBabyNameDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateBabyName'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateBabyName>>, {id: string;data: BodyType<AdminUpdateBabyNameDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  adminControllerUpdateBabyName(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateBabyNameMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateBabyName>>>
    export type AdminControllerUpdateBabyNameMutationBody = BodyType<AdminUpdateBabyNameDto>
    export type AdminControllerUpdateBabyNameMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateBabyName = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateBabyName>>, TError,{id: string;data: BodyType<AdminUpdateBabyNameDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateBabyName>>,
        TError,
        {id: string;data: BodyType<AdminUpdateBabyNameDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateBabyNameMutationOptions(options), queryClient);
    }

export const getAdminControllerGetArticlesContentUrl = () => {




  return `/api/admin/content/articles`
}

export const adminControllerGetArticlesContent = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetArticlesContentUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetArticlesContentQueryKey = () => {
    return [
    `/api/admin/content/articles`
    ] as const;
    }


export const getAdminControllerGetArticlesContentQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetArticlesContentQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>> = ({ signal }) => adminControllerGetArticlesContent({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetArticlesContentQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>>
export type AdminControllerGetArticlesContentQueryError = ErrorType<unknown>


export function useAdminControllerGetArticlesContent<TData = Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetArticlesContent>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetArticlesContent>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetArticlesContent<TData = Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetArticlesContent>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetArticlesContent>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetArticlesContent<TData = Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetArticlesContent<TData = Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetArticlesContent>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetArticlesContentQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerUpdateArticleUrl = (id: string,) => {




  return `/api/admin/content/articles/${id}`
}

export const adminControllerUpdateArticle = async (id: string,
    adminUpdateArticleDto: AdminUpdateArticleDto, options?: RequestInit): Promise<AdminControllerUpdateArticle200> => {

  return customFetch<AdminControllerUpdateArticle200>(getAdminControllerUpdateArticleUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateArticleDto)
  }
);}




export const getAdminControllerUpdateArticleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateArticle>>, TError,{id: string;data: BodyType<AdminUpdateArticleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateArticle>>, TError,{id: string;data: BodyType<AdminUpdateArticleDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateArticle'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateArticle>>, {id: string;data: BodyType<AdminUpdateArticleDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  adminControllerUpdateArticle(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateArticleMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateArticle>>>
    export type AdminControllerUpdateArticleMutationBody = BodyType<AdminUpdateArticleDto>
    export type AdminControllerUpdateArticleMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateArticle = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateArticle>>, TError,{id: string;data: BodyType<AdminUpdateArticleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateArticle>>,
        TError,
        {id: string;data: BodyType<AdminUpdateArticleDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateArticleMutationOptions(options), queryClient);
    }

export const getAdminControllerUpdateFaqUrl = (id: string,) => {




  return `/api/admin/content/faqs/${id}`
}

export const adminControllerUpdateFaq = async (id: string,
    adminUpdateFaqDto: AdminUpdateFaqDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdateFaqUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateFaqDto)
  }
);}




export const getAdminControllerUpdateFaqMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateFaq>>, TError,{id: string;data: BodyType<AdminUpdateFaqDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateFaq>>, TError,{id: string;data: BodyType<AdminUpdateFaqDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateFaq'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateFaq>>, {id: string;data: BodyType<AdminUpdateFaqDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  adminControllerUpdateFaq(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateFaqMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateFaq>>>
    export type AdminControllerUpdateFaqMutationBody = BodyType<AdminUpdateFaqDto>
    export type AdminControllerUpdateFaqMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateFaq = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateFaq>>, TError,{id: string;data: BodyType<AdminUpdateFaqDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateFaq>>,
        TError,
        {id: string;data: BodyType<AdminUpdateFaqDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateFaqMutationOptions(options), queryClient);
    }

export const getAdminControllerUpdateMythUrl = (id: string,) => {




  return `/api/admin/content/myths/${id}`
}

export const adminControllerUpdateMyth = async (id: string,
    adminUpdateMythDto: AdminUpdateMythDto, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerUpdateMythUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(adminUpdateMythDto)
  }
);}




export const getAdminControllerUpdateMythMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateMyth>>, TError,{id: string;data: BodyType<AdminUpdateMythDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateMyth>>, TError,{id: string;data: BodyType<AdminUpdateMythDto>}, TContext> => {

const mutationKey = ['adminControllerUpdateMyth'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerUpdateMyth>>, {id: string;data: BodyType<AdminUpdateMythDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  adminControllerUpdateMyth(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerUpdateMythMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerUpdateMyth>>>
    export type AdminControllerUpdateMythMutationBody = BodyType<AdminUpdateMythDto>
    export type AdminControllerUpdateMythMutationError = ErrorType<unknown>

    export const useAdminControllerUpdateMyth = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerUpdateMyth>>, TError,{id: string;data: BodyType<AdminUpdateMythDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerUpdateMyth>>,
        TError,
        {id: string;data: BodyType<AdminUpdateMythDto>},
        TContext
      > => {
      return useMutation(getAdminControllerUpdateMythMutationOptions(options), queryClient);
    }

export const getAdminControllerGetReportedPostsUrl = (params: AdminControllerGetReportedPostsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/admin/moderation/posts?${stringifiedParams}` : `/api/admin/moderation/posts`
}

export const adminControllerGetReportedPosts = async (params: AdminControllerGetReportedPostsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAdminControllerGetReportedPostsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetReportedPostsQueryKey = (params?: AdminControllerGetReportedPostsParams,) => {
    return [
    `/api/admin/moderation/posts`, ...(params ? [params] : [])
    ] as const;
    }


export const getAdminControllerGetReportedPostsQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError = ErrorType<unknown>>(params: AdminControllerGetReportedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetReportedPostsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>> = ({ signal }) => adminControllerGetReportedPosts(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetReportedPostsQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>>
export type AdminControllerGetReportedPostsQueryError = ErrorType<unknown>


export function useAdminControllerGetReportedPosts<TData = Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetReportedPostsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetReportedPosts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetReportedPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetReportedPosts<TData = Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetReportedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetReportedPosts>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetReportedPosts>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetReportedPosts<TData = Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetReportedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetReportedPosts<TData = Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError = ErrorType<unknown>>(
 params: AdminControllerGetReportedPostsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedPosts>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetReportedPostsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerDeleteReportedPostUrl = (postId: string,) => {




  return `/api/admin/moderation/posts/${postId}`
}

export const adminControllerDeleteReportedPost = async (postId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDeleteReportedPostUrl(postId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDeleteReportedPostMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>, TError,{postId: string}, TContext> => {

const mutationKey = ['adminControllerDeleteReportedPost'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  adminControllerDeleteReportedPost(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDeleteReportedPostMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>>

    export type AdminControllerDeleteReportedPostMutationError = ErrorType<unknown>

    export const useAdminControllerDeleteReportedPost = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDeleteReportedPost>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDeleteReportedPostMutationOptions(options), queryClient);
    }

export const getAdminControllerDismissPostReportsUrl = (postId: string,) => {




  return `/api/admin/moderation/posts/${postId}/dismiss`
}

export const adminControllerDismissPostReports = async (postId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDismissPostReportsUrl(postId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDismissPostReportsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissPostReports>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissPostReports>>, TError,{postId: string}, TContext> => {

const mutationKey = ['adminControllerDismissPostReports'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDismissPostReports>>, {postId: string}> = (props) => {
          const {postId} = props ?? {};

          return  adminControllerDismissPostReports(postId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDismissPostReportsMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDismissPostReports>>>

    export type AdminControllerDismissPostReportsMutationError = ErrorType<unknown>

    export const useAdminControllerDismissPostReports = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissPostReports>>, TError,{postId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDismissPostReports>>,
        TError,
        {postId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDismissPostReportsMutationOptions(options), queryClient);
    }

export const getAdminControllerGetReportedAiResponsesUrl = () => {




  return `/api/admin/moderation/ai-responses`
}

export const adminControllerGetReportedAiResponses = async ( options?: RequestInit): Promise<AdminControllerGetReportedAiResponses200Item[]> => {

  return customFetch<AdminControllerGetReportedAiResponses200Item[]>(getAdminControllerGetReportedAiResponsesUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAdminControllerGetReportedAiResponsesQueryKey = () => {
    return [
    `/api/admin/moderation/ai-responses`
    ] as const;
    }


export const getAdminControllerGetReportedAiResponsesQueryOptions = <TData = Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAdminControllerGetReportedAiResponsesQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>> = ({ signal }) => adminControllerGetReportedAiResponses({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AdminControllerGetReportedAiResponsesQueryResult = NonNullable<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>>
export type AdminControllerGetReportedAiResponsesQueryError = ErrorType<unknown>


export function useAdminControllerGetReportedAiResponses<TData = Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetReportedAiResponses<TData = Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>,
          TError,
          Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAdminControllerGetReportedAiResponses<TData = Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAdminControllerGetReportedAiResponses<TData = Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof adminControllerGetReportedAiResponses>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAdminControllerGetReportedAiResponsesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAdminControllerDismissAiResponseReportUrl = (reportId: string,) => {




  return `/api/admin/moderation/ai-responses/${reportId}`
}

export const adminControllerDismissAiResponseReport = async (reportId: string, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAdminControllerDismissAiResponseReportUrl(reportId),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getAdminControllerDismissAiResponseReportMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>, TError,{reportId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>, TError,{reportId: string}, TContext> => {

const mutationKey = ['adminControllerDismissAiResponseReport'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>, {reportId: string}> = (props) => {
          const {reportId} = props ?? {};

          return  adminControllerDismissAiResponseReport(reportId,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AdminControllerDismissAiResponseReportMutationResult = NonNullable<Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>>

    export type AdminControllerDismissAiResponseReportMutationError = ErrorType<unknown>

    export const useAdminControllerDismissAiResponseReport = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>, TError,{reportId: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof adminControllerDismissAiResponseReport>>,
        TError,
        {reportId: string},
        TContext
      > => {
      return useMutation(getAdminControllerDismissAiResponseReportMutationOptions(options), queryClient);
    }

export const getArticlesControllerGetArticlesUrl = (params?: ArticlesControllerGetArticlesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/articles?${stringifiedParams}` : `/api/articles`
}

/**
 * @summary Get health and pregnancy articles with category filter and search
 */
export const articlesControllerGetArticles = async (params?: ArticlesControllerGetArticlesParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getArticlesControllerGetArticlesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getArticlesControllerGetArticlesQueryKey = (params?: ArticlesControllerGetArticlesParams,) => {
    return [
    `/api/articles`, ...(params ? [params] : [])
    ] as const;
    }


export const getArticlesControllerGetArticlesQueryOptions = <TData = Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError = ErrorType<unknown>>(params?: ArticlesControllerGetArticlesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getArticlesControllerGetArticlesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof articlesControllerGetArticles>>> = ({ signal }) => articlesControllerGetArticles(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ArticlesControllerGetArticlesQueryResult = NonNullable<Awaited<ReturnType<typeof articlesControllerGetArticles>>>
export type ArticlesControllerGetArticlesQueryError = ErrorType<unknown>


export function useArticlesControllerGetArticles<TData = Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError = ErrorType<unknown>>(
 params: undefined |  ArticlesControllerGetArticlesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetArticles>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetArticles>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetArticles<TData = Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetArticlesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetArticles>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetArticles>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetArticles<TData = Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetArticlesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get health and pregnancy articles with category filter and search
 */

export function useArticlesControllerGetArticles<TData = Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetArticlesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticles>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getArticlesControllerGetArticlesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getArticlesControllerGetFaqsUrl = (params?: ArticlesControllerGetFaqsParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/articles/faqs?${stringifiedParams}` : `/api/articles/faqs`
}

/**
 * @summary Get medical frequently asked questions
 */
export const articlesControllerGetFaqs = async (params?: ArticlesControllerGetFaqsParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getArticlesControllerGetFaqsUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getArticlesControllerGetFaqsQueryKey = (params?: ArticlesControllerGetFaqsParams,) => {
    return [
    `/api/articles/faqs`, ...(params ? [params] : [])
    ] as const;
    }


export const getArticlesControllerGetFaqsQueryOptions = <TData = Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError = ErrorType<unknown>>(params?: ArticlesControllerGetFaqsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getArticlesControllerGetFaqsQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof articlesControllerGetFaqs>>> = ({ signal }) => articlesControllerGetFaqs(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ArticlesControllerGetFaqsQueryResult = NonNullable<Awaited<ReturnType<typeof articlesControllerGetFaqs>>>
export type ArticlesControllerGetFaqsQueryError = ErrorType<unknown>


export function useArticlesControllerGetFaqs<TData = Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError = ErrorType<unknown>>(
 params: undefined |  ArticlesControllerGetFaqsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetFaqs>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetFaqs>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetFaqs<TData = Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetFaqsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetFaqs>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetFaqs>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetFaqs<TData = Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetFaqsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get medical frequently asked questions
 */

export function useArticlesControllerGetFaqs<TData = Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError = ErrorType<unknown>>(
 params?: ArticlesControllerGetFaqsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetFaqs>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getArticlesControllerGetFaqsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getArticlesControllerGetMythsUrl = () => {




  return `/api/articles/myths`
}

/**
 * @summary Get women health and pregnancy myths and facts
 */
export const articlesControllerGetMyths = async ( options?: RequestInit): Promise<void> => {

  return customFetch<void>(getArticlesControllerGetMythsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getArticlesControllerGetMythsQueryKey = () => {
    return [
    `/api/articles/myths`
    ] as const;
    }


export const getArticlesControllerGetMythsQueryOptions = <TData = Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getArticlesControllerGetMythsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof articlesControllerGetMyths>>> = ({ signal }) => articlesControllerGetMyths({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ArticlesControllerGetMythsQueryResult = NonNullable<Awaited<ReturnType<typeof articlesControllerGetMyths>>>
export type ArticlesControllerGetMythsQueryError = ErrorType<unknown>


export function useArticlesControllerGetMyths<TData = Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetMyths>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetMyths>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetMyths<TData = Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetMyths>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetMyths>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetMyths<TData = Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get women health and pregnancy myths and facts
 */

export function useArticlesControllerGetMyths<TData = Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetMyths>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getArticlesControllerGetMythsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getArticlesControllerGetArticleByIdUrl = (id: string,) => {




  return `/api/articles/${id}`
}

/**
 * @summary Get article details by ID
 */
export const articlesControllerGetArticleById = async (id: string, options?: RequestInit): Promise<ArticlesControllerGetArticleById200> => {

  return customFetch<ArticlesControllerGetArticleById200>(getArticlesControllerGetArticleByIdUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getArticlesControllerGetArticleByIdQueryKey = (id: string,) => {
    return [
    `/api/articles/${id}`
    ] as const;
    }


export const getArticlesControllerGetArticleByIdQueryOptions = <TData = Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getArticlesControllerGetArticleByIdQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof articlesControllerGetArticleById>>> = ({ signal }) => articlesControllerGetArticleById(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ArticlesControllerGetArticleByIdQueryResult = NonNullable<Awaited<ReturnType<typeof articlesControllerGetArticleById>>>
export type ArticlesControllerGetArticleByIdQueryError = ErrorType<unknown>


export function useArticlesControllerGetArticleById<TData = Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetArticleById>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetArticleById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetArticleById<TData = Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof articlesControllerGetArticleById>>,
          TError,
          Awaited<ReturnType<typeof articlesControllerGetArticleById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useArticlesControllerGetArticleById<TData = Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Get article details by ID
 */

export function useArticlesControllerGetArticleById<TData = Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof articlesControllerGetArticleById>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getArticlesControllerGetArticleByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAssistantControllerGetDailyInsightUrl = () => {




  return `/api/assistant/daily-insight`
}

/**
 * @summary Günlük sağlık asistanı içgörüsü ve başlangıç kartı
 */
export const assistantControllerGetDailyInsight = async ( options?: RequestInit): Promise<AssistantControllerGetDailyInsight200> => {

  return customFetch<AssistantControllerGetDailyInsight200>(getAssistantControllerGetDailyInsightUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAssistantControllerGetDailyInsightQueryKey = () => {
    return [
    `/api/assistant/daily-insight`
    ] as const;
    }


export const getAssistantControllerGetDailyInsightQueryOptions = <TData = Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAssistantControllerGetDailyInsightQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>> = ({ signal }) => assistantControllerGetDailyInsight({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AssistantControllerGetDailyInsightQueryResult = NonNullable<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>>
export type AssistantControllerGetDailyInsightQueryError = ErrorType<unknown>


export function useAssistantControllerGetDailyInsight<TData = Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>,
          TError,
          Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAssistantControllerGetDailyInsight<TData = Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>,
          TError,
          Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAssistantControllerGetDailyInsight<TData = Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
/**
 * @summary Günlük sağlık asistanı içgörüsü ve başlangıç kartı
 */

export function useAssistantControllerGetDailyInsight<TData = Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof assistantControllerGetDailyInsight>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAssistantControllerGetDailyInsightQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAssistantControllerChatUrl = () => {




  return `/api/assistant/chat`
}

/**
 * @summary Yapay zekâ sağlık asistanı ile sohbet
 */
export const assistantControllerChat = async (chatAssistantDto: ChatAssistantDto, options?: RequestInit): Promise<AssistantResponseDto> => {

  return customFetch<AssistantResponseDto>(getAssistantControllerChatUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(chatAssistantDto)
  }
);}




export const getAssistantControllerChatMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assistantControllerChat>>, TError,{data: BodyType<ChatAssistantDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof assistantControllerChat>>, TError,{data: BodyType<ChatAssistantDto>}, TContext> => {

const mutationKey = ['assistantControllerChat'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof assistantControllerChat>>, {data: BodyType<ChatAssistantDto>}> = (props) => {
          const {data} = props ?? {};

          return  assistantControllerChat(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AssistantControllerChatMutationResult = NonNullable<Awaited<ReturnType<typeof assistantControllerChat>>>
    export type AssistantControllerChatMutationBody = BodyType<ChatAssistantDto>
    export type AssistantControllerChatMutationError = ErrorType<unknown>

    /**
 * @summary Yapay zekâ sağlık asistanı ile sohbet
 */
export const useAssistantControllerChat = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assistantControllerChat>>, TError,{data: BodyType<ChatAssistantDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof assistantControllerChat>>,
        TError,
        {data: BodyType<ChatAssistantDto>},
        TContext
      > => {
      return useMutation(getAssistantControllerChatMutationOptions(options), queryClient);
    }

export const getAssistantControllerReportResponseUrl = () => {




  return `/api/assistant/report`
}

/**
 * @summary Hatalı veya uygunsuz yapay zekâ yanıtını şikayet et
 */
export const assistantControllerReportResponse = async (reportAssistantResponseDto: ReportAssistantResponseDto, options?: RequestInit): Promise<SuccessResponseDto> => {

  return customFetch<SuccessResponseDto>(getAssistantControllerReportResponseUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(reportAssistantResponseDto)
  }
);}




export const getAssistantControllerReportResponseMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assistantControllerReportResponse>>, TError,{data: BodyType<ReportAssistantResponseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof assistantControllerReportResponse>>, TError,{data: BodyType<ReportAssistantResponseDto>}, TContext> => {

const mutationKey = ['assistantControllerReportResponse'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof assistantControllerReportResponse>>, {data: BodyType<ReportAssistantResponseDto>}> = (props) => {
          const {data} = props ?? {};

          return  assistantControllerReportResponse(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AssistantControllerReportResponseMutationResult = NonNullable<Awaited<ReturnType<typeof assistantControllerReportResponse>>>
    export type AssistantControllerReportResponseMutationBody = BodyType<ReportAssistantResponseDto>
    export type AssistantControllerReportResponseMutationError = ErrorType<unknown>

    /**
 * @summary Hatalı veya uygunsuz yapay zekâ yanıtını şikayet et
 */
export const useAssistantControllerReportResponse = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof assistantControllerReportResponse>>, TError,{data: BodyType<ReportAssistantResponseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof assistantControllerReportResponse>>,
        TError,
        {data: BodyType<ReportAssistantResponseDto>},
        TContext
      > => {
      return useMutation(getAssistantControllerReportResponseMutationOptions(options), queryClient);
    }

