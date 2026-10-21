import { Controller, Get, Patch, Post, Delete, Body, Param, Query, Req, Res, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AdminService } from './admin.service';
import {
  AdminUsersListResponseDto, AdminUserDetailDto,
  AdminDeletedAccountsResponseDto,
  UpdateWeekContentDto, UpdatedWeekContentResponseDto,
  SendNotificationDto, SendNotificationResponseDto,
  AdminPostsListResponseDto, AdminCommentsListResponseDto,
  UpdateAdminUserDto, AdminStatsDto,
  AdminUpdatePostDto, AdminUpdateCommentDto,
  AdminUpdateSymptomTypeDto, AdminUpdateBabyNameDto,
  AdminUpdateArticleDto, AdminUpdateFaqDto, AdminUpdateMythDto,
} from './dto/admin.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponseDto } from '../common/dto/success.dto';

@ApiTags('Admin')
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('admin-portal')
  async getAdminPortal(@Res() res: Response): Promise<void> {
    const html = this.adminService.getAdminPortalHtml();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.send(html);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/stats')
  async getStats(@Req() req: Request): Promise<AdminStatsDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/users')
  async getUsers(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<AdminUsersListResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getUsers(page, limit, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/deleted-accounts')
  async getDeletedAccounts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<AdminDeletedAccountsResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getDeletedAccounts(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/users/:userId')
  async getUserDetail(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<AdminUserDetailDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getUserDetail(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/users/:userId')
  async updateUser(
    @Req() req: Request,
    @Param('userId') userId: string,
    @Body() dto: UpdateAdminUserDto,
  ): Promise<AdminUserDetailDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateUser(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/users/:userId')
  async deleteUser(
    @Req() req: Request,
    @Param('userId') userId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.deleteUser(userId, (req as any).user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/pregnancy/weeks/:weekNumber')
  async updateWeekContent(
    @Req() req: Request,
    @Param('weekNumber', ParseIntPipe) weekNumber: number,
    @Body() dto: UpdateWeekContentDto,
  ): Promise<UpdatedWeekContentResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateWeekContent(weekNumber, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('api/admin/notifications/send')
  async sendNotification(
    @Req() req: Request,
    @Body() dto: SendNotificationDto,
  ): Promise<SendNotificationResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.sendNotification(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/posts')
  async getPosts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<AdminPostsListResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getPosts(page, limit, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/posts/:postId')
  async deletePost(
    @Req() req: Request,
    @Param('postId') postId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.adminDeletePost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/comments')
  async getComments(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<AdminCommentsListResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getComments(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/comments/:commentId')
  async deleteComment(
    @Req() req: Request,
    @Param('commentId') commentId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.adminDeleteComment(commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/posts-with-comments')
  async getPostsWithComments(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getPostsWithComments(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/posts/:postId')
  async updatePost(
    @Req() req: Request,
    @Param('postId') postId: string,
    @Body() dto: AdminUpdatePostDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.adminUpdatePost(postId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/comments/:commentId')
  async updateComment(
    @Req() req: Request,
    @Param('commentId') commentId: string,
    @Body() dto: AdminUpdateCommentDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.adminUpdateComment(commentId, dto.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/content/pregnancy-weeks')
  async getPregnancyWeeks(@Req() req: Request) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getPregnancyWeeksList();
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/content/pregnancy-weeks/:weekNumber')
  async getPregnancyWeekDetail(
    @Req() req: Request,
    @Param('weekNumber', ParseIntPipe) weekNumber: number,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getPregnancyWeekDetail(weekNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/content/symptom-types')
  async getSymptomTypes(@Req() req: Request) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getSymptomTypes();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/content/symptom-types/:id')
  async updateSymptomType(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AdminUpdateSymptomTypeDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateSymptomType(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/content/baby-names')
  async getBabyNames(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getBabyNames(page, limit, search);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/content/baby-names/:id')
  async updateBabyName(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AdminUpdateBabyNameDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateBabyName(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/content/articles')
  async getArticlesContent(@Req() req: Request) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getArticlesContent();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/content/articles/:id')
  async updateArticle(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AdminUpdateArticleDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateArticleContent(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/content/faqs/:id')
  async updateFaq(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AdminUpdateFaqDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateFaqContent(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('api/admin/content/myths/:id')
  async updateMyth(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: AdminUpdateMythDto,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.updateMythContent(id, dto);
  }

  // Moderation Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('api/admin/moderation/posts')
  async getReportedPosts(
    @Req() req: Request,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getReportedPosts(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/moderation/posts/:postId')
  async deleteReportedPost(
    @Req() req: Request,
    @Param('postId') postId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.deleteReportedPost(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/moderation/posts/:postId/dismiss')
  async dismissPostReports(
    @Req() req: Request,
    @Param('postId') postId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.dismissPostReports(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('api/admin/moderation/ai-responses')
  async getReportedAiResponses(@Req() req: Request) {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.getReportedAiResponses();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('api/admin/moderation/ai-responses/:reportId')
  async dismissAiResponseReport(
    @Req() req: Request,
    @Param('reportId') reportId: string,
  ): Promise<SuccessResponseDto> {
    await this.adminService.assertAdmin((req as any).user.id);
    return this.adminService.dismissAiResponseReport(reportId);
  }
}
