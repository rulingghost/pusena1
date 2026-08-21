import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CommunityService } from './community.service';
import { CreatePostDto, EditPostDto, CreateCommentDto, ReportPostDto, CommunityPostResponseDto, PostsListResponseDto, CommentResponseDto, CommentsListResponseDto, LikeResponseDto, SaveResponseDto } from './dto/community.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Community')
@Controller('api/community')
@UseGuards(JwtAuthGuard)
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('posts')
  async createPost(@Req() req: Request, @Body() dto: CreatePostDto): Promise<CommunityPostResponseDto> {
    return this.communityService.createPost((req as any).user.id, dto.content, dto.category, dto.pregnancyWeek);
  }

  @Get('users/search')
  async searchUsers(
    @Req() req: Request,
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(30), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.searchUsers((req as any).user.id, q ?? '', page ?? 1, limit ?? 30);
  }

  @Get('users/:targetUserId/profile')
  async getUserProfile(@Req() req: Request, @Param('targetUserId') targetUserId: string) {
    return this.communityService.getUserProfile((req as any).user.id, targetUserId);
  }

  @Get('users/:targetUserId/posts')
  async getUserPosts(
    @Req() req: Request,
    @Param('targetUserId') targetUserId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.getUserPosts((req as any).user.id, targetUserId, page ?? 1, limit ?? 20);
  }

  @Post('users/:targetUserId/follow')
  async toggleFollow(@Req() req: Request, @Param('targetUserId') targetUserId: string) {
    return this.communityService.toggleFollow((req as any).user.id, targetUserId);
  }

  @Get('users/:targetUserId/followers')
  async getFollowers(@Req() req: Request, @Param('targetUserId') targetUserId: string) {
    return this.communityService.getFollowList((req as any).user.id, targetUserId, 'followers');
  }

  @Get('users/:targetUserId/following')
  async getFollowing(@Req() req: Request, @Param('targetUserId') targetUserId: string) {
    return this.communityService.getFollowList((req as any).user.id, targetUserId, 'following');
  }

  @Get('my-posts')
  async getMyPosts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.getMyPostsWithComments((req as any).user.id, page ?? 1, limit ?? 20);
  }

  @Get('saved-posts')
  async getSavedPosts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ) {
    return this.communityService.getSavedPosts((req as any).user.id, page ?? 1, limit ?? 20);
  }

  @Get('saved-articles')
  async getSavedArticles(@Req() req: Request) {
    return this.communityService.getSavedArticles((req as any).user.id);
  }

  @Post('saved-articles/:articleId')
  async toggleSavedArticle(
    @Req() req: Request,
    @Param('articleId') articleId: string,
    @Body() body: { kind?: string },
  ) {
    return this.communityService.toggleSavedArticle((req as any).user.id, articleId, body?.kind ?? 'article');
  }

  @Get('posts')
  async getPosts(
    @Req() req: Request,
    @Query('category') category?: string,
    @Query('q') q?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number,
  ): Promise<PostsListResponseDto> {
    return this.communityService.getPosts((req as any).user.id, category, page ?? 1, limit ?? 20, q);
  }

  @Get('posts/:postId')
  async getPost(@Req() req: Request, @Param('postId') postId: string): Promise<CommunityPostResponseDto> {
    return this.communityService.getPost((req as any).user.id, postId);
  }

  @Put('posts/:postId')
  async editPost(@Req() req: Request, @Param('postId') postId: string, @Body() dto: EditPostDto): Promise<CommunityPostResponseDto> {
    return this.communityService.editPost((req as any).user.id, postId, dto.content);
  }

  @Delete('posts/:postId')
  async deletePost(@Req() req: Request, @Param('postId') postId: string): Promise<SuccessResponseDto> {
    return this.communityService.deletePost((req as any).user.id, postId);
  }

  @Post('posts/:postId/like')
  async likePost(@Req() req: Request, @Param('postId') postId: string): Promise<LikeResponseDto> {
    return this.communityService.toggleLike((req as any).user.id, postId);
  }

  @Post('posts/:postId/save')
  async savePost(@Req() req: Request, @Param('postId') postId: string): Promise<SaveResponseDto> {
    return this.communityService.toggleSave((req as any).user.id, postId);
  }

  @Post('posts/:postId/report')
  async reportPost(@Req() req: Request, @Param('postId') postId: string, @Body() dto: ReportPostDto): Promise<SuccessResponseDto> {
    return this.communityService.reportPost((req as any).user.id, postId, dto.reason);
  }

  @Get('posts/:postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<CommentsListResponseDto> {
    return this.communityService.getComments(postId, page, limit);
  }

  @Post('posts/:postId/comments')
  async createComment(@Req() req: Request, @Param('postId') postId: string, @Body() dto: CreateCommentDto): Promise<CommentResponseDto> {
    return this.communityService.createComment((req as any).user.id, postId, dto.content);
  }

  @Delete('comments/:commentId')
  async deleteComment(@Req() req: Request, @Param('commentId') commentId: string): Promise<SuccessResponseDto> {
    return this.communityService.deleteComment((req as any).user.id, commentId);
  }

  @Post('block/:userId')
  async blockUser(@Req() req: Request, @Param('userId') targetUserId: string): Promise<SuccessResponseDto> {
    return this.communityService.blockUser((req as any).user.id, targetUserId);
  }

  @Delete('block/:userId')
  async unblockUser(@Req() req: Request, @Param('userId') targetUserId: string): Promise<SuccessResponseDto> {
    return this.communityService.unblockUser((req as any).user.id, targetUserId);
  }
}
