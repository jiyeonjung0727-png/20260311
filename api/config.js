// Vercel Serverless Function: 환경 변수에서 Supabase 설정을 읽어 클라이언트에 전달
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'public, s-maxage=60');
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  });
};
