import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    console.log('🔧 Supabase URL:', supabaseUrl);
    console.log('🔧 Service Key configured:', supabaseKey ? 'Yes' : 'No');
    console.log('🔧 Service Key (first 30 chars):', supabaseKey?.substring(0, 30));

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async verifyToken(token: string) {
    try {
      console.log('🔍 Verifying token with Supabase...');
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error) {
        console.error('❌ Supabase error:', error.message);
        throw error;
      }

      if (data.user) {
        console.log('✅ Token verified for user:', data.user.email);
      }

      return data.user;
    } catch (error) {
      console.error('❌ Token verification failed:', error.message);
      return null;
    }
  }

  getSupabaseClient(): SupabaseClient {
    return this.supabase;
  }
}
