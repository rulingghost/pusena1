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
  AdminControllerGetCommentsParams,
  AdminControllerGetPostsParams,
  AdminControllerGetUsersParams,
  AdminPostsListResponseDto,
  AdminUserDetailDto,
  AdminUsersListResponseDto,
  AllWeeksResponseDto,
  AnswerActionDto,
  AuthControllerGoogleAuthParams,
  AuthControllerGoogleCallbackParams,
  AuthResponseDto,
  CalendarResponseDto,
  ChangePasswordDto,
  CommentResponseDto,
  CommentsListResponseDto,
  CommunityControllerGetCommentsParams,
  CommunityControllerGetPostsParams,
  CommunityPostResponseDto,
  CompleteSetupResponseDto,
  CreateCommentDto,
  CreatePostDto,
  CreatePregnancyDto,
  CreatePregnancyResponseDto,
  CreateRelationshipDto,
  CreateSpecialDateDto,
  CreateSymptomsDto,
  DashboardResponseDto,
  DeleteAccountDto,
  ForgotPasswordDto,
  LikeResponseDto,
  LoginDto,
  MeResponseDto,
  NotificationSettingsDto,
  NotificationsControllerGetAllParams,
  NotificationsListResponseDto,
  PeriodControllerCalendarParams,
  PeriodControllerHistoryParams,
  PeriodDayResponseDto,
  PeriodHistoryResponseDto,
  PeriodLogDto,
  PeriodResponseDto,
  PeriodSetupDto,
  PeriodSetupResponseDto,
  PostsListResponseDto,
  PregnancyResponseDto,
  PrivacySettingsDto,
  PublicUserResponseDto,
  RefreshTokenDto,
  RelationshipResponseDto,
  ReportPostDto,
  SaveResponseDto,
  SendNotificationDto,
  SendNotificationResponseDto,
  SettingsResponseDto,
  SignupDto,
  SpecialDateResponseDto,
  SpecialDatesControllerGetAllParams,
  SpecialDatesListResponseDto,
  StartPeriodDto,
  StartPeriodResponseDto,
  SuccessMessageResponseDto,
  SuccessResponseDto,
  SymptomTypesResponseDto,
  SymptomsControllerGetParams,
  SymptomsResponseDto,
  TokensResponseDto,
  UnreadCountResponseDto,
  UpdateModulesDto,
  UpdateNotificationsDto,
  UpdatePrivacyDto,
  UpdateProfileDto,
  UpdateRelationshipDto,
  UpdateSpecialDateDto,
  UpdateWeekContentDto,
  UpdatedWeekContentResponseDto,
  UserProfileResponseDto,
  WeekContentResponseDto
} from './schemas';

import { customFetch } from '../customFetch';
import type { ErrorType , BodyType } from '../customFetch';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAuthControllerSignupUrl = () => {




  return `/api/signup`
}

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

export const getAuthControllerChangePasswordUrl = () => {




  return `/api/auth/change-password`
}

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

export const getPregnancyControllerGetUrl = () => {




  return `/api/pregnancy`
}

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

