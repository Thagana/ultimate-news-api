import axios from "axios";
import logger from "../utils/logger";
import NewsSettings from '../models/SQL/NewsSettings';
import getNews from "../helpers/getNews";

interface ArticleResponse {
  source: {
    id: string | null;
    name: string;
  };
  title: string;
  author: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

interface DataFormat {
  id: string;
  title: string;
  source: string;
  author: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  description: string;
  dateCreated: string;
  category: string;
  country: string;
}

const fetchNews = async (userId: number): Promise<{
  success: boolean;
  data?: DataFormat[];
}> => {
  try {
    const settings = await NewsSettings.findOne({
      where: {
        user_id: userId
      }
    });
    if (!settings) {
      return {
        success: false
      }
    }
    const category = settings.category;
    const location = settings.location;

    const news = await getNews(category, location);
    
    if (!news.success) {
      return {
        success: false,
      };
    }
    return {
      success: true,
      data: news.data,
    };
  } catch (error) {
    logger.error((error as Error).stack || error);
    return {
      success: false,
    };
  }
};

export default fetchNews;
