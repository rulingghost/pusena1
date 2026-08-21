import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';

@ApiTags('Articles')
@Controller('api/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  @ApiOperation({ summary: 'Get health and pregnancy articles with category filter and search' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getArticles(@Query('category') category?: string, @Query('search') search?: string) {
    return this.articlesService.getArticles(category, search);
  }

  @Get('faqs')
  @ApiOperation({ summary: 'Get medical frequently asked questions' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getFaqs(@Query('category') category?: string, @Query('search') search?: string) {
    return this.articlesService.getFaqs(category, search);
  }

  @Get('myths')
  @ApiOperation({ summary: 'Get women health and pregnancy myths and facts' })
  async getMyths() {
    return this.articlesService.getMyths();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article details by ID' })
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }
}
