-- رسين · first topic and text sources for the v1 test.
-- Run after 001_init.sql. Change the topic to whatever the team wants to monitor.

insert into topics (name, kind, keywords) values
  ('وزارة الصحة', 'entity', array['وزارة الصحة','الصحة','مستشفى','الصحي','اللقاح'])
on conflict do nothing;

-- Official RSS feeds from the team's tech doc, plus wider Arabic news feeds.
-- If a feed stops working, the worker records it in sources.last_status and moves on.
insert into sources (name, kind, site_url, feed_url, is_official) values
  ('جريدة الرياض',      'news',     'https://www.alriyadh.com',  'https://www.alriyadh.com/rss',                 false),
  ('صحيفة الجزيرة',     'news',     'https://www.al-jazirah.com','https://www.al-jazirah.com/rss/ln.xml',        false),
  ('صحيفة سبق',         'news',     'https://sabq.org',          'https://sabq.org/rss',                         false),
  ('صحيفة عكاظ',        'news',     'https://www.okaz.com.sa',   'https://www.okaz.com.sa/rss',                  false),
  ('صحيفة اليوم',       'news',     'https://www.alyaum.com',    'https://www.alyaum.com/rss',                   false),
  ('وكالة الأنباء السعودية','official','https://www.spa.gov.sa',  'https://www.spa.gov.sa/rss.xml',               true),
  ('وزارة الصحة',       'official', 'https://www.moh.gov.sa',    'https://www.moh.gov.sa/Ministry/MediaCenter/News/Pages/rss.aspx', true),
  ('أخبار Google',      'aggregator','https://news.google.com',  'https://news.google.com/rss/search?q=%D9%88%D8%B2%D8%A7%D8%B1%D8%A9+%D8%A7%D9%84%D8%B5%D8%AD%D8%A9&hl=ar&gl=SA&ceid=SA:ar', false)
on conflict (feed_url) do nothing;
