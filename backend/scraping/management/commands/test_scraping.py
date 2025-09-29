from django.core.management.base import BaseCommand
from scraping.real_instagram_scraper import RealInstagramScraper
import json

class Command(BaseCommand):
    help = 'Test real Instagram web scraping functionality'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--test-connection',
            action='store_true',
            help='Test basic Instagram connection'
        )
        parser.add_argument(
            '--scrape-profile',
            type=str,
            help='Username to scrape (e.g., cristiano, selenagomez)'
        )
        parser.add_argument(
            '--posts-limit',
            type=int,
            default=5,
            help='Number of posts to scrape (default: 5)'
        )
        parser.add_argument(
            '--full-scrape',
            type=str,
            help='Complete profile scraping with posts'
        )
    
    def handle(self, *args, **options):
        scraper = RealInstagramScraper()
        
        if options['test_connection']:
            self.stdout.write('🔍 Testing Instagram connection...')
            result = scraper.test_connection()
            
            if result['success']:
                self.stdout.write(
                    self.style.SUCCESS('✅ Instagram scraping is working!')
                )
                profile = result['test_profile']
                self.stdout.write(f"Test profile: @{profile['username']}")
                self.stdout.write(f"Followers: {profile['followers']:,}")
                self.stdout.write(f"Posts: {profile['posts']:,}")
            else:
                self.stdout.write(
                    self.style.ERROR(f"❌ Instagram scraping failed: {result['error']}")
                )
                for suggestion in result.get('suggestions', []):
                    self.stdout.write(f"  💡 {suggestion}")
        
        elif options['scrape_profile']:
            username = options['scrape_profile']
            self.stdout.write(f'🔍 Scraping profile: @{username}')
            
            result = scraper.scrape_profile(username)
            
            if result.get('scraping_success'):
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Successfully scraped @{username}!')
                )
                self.stdout.write(f"Full name: {result.get('full_name', 'N/A')}")
                self.stdout.write(f"Followers: {result.get('followers_count', 0):,}")
                self.stdout.write(f"Following: {result.get('following_count', 0):,}")
                self.stdout.write(f"Posts: {result.get('posts_count', 0):,}")
                self.stdout.write(f"Verified: {result.get('is_verified', False)}")
                self.stdout.write(f"Category: {result.get('category', 'N/A')}")
                
                if result.get('bio'):
                    bio = result['bio']
                    if len(bio) > 100:
                        bio = bio[:100] + '...'
                    self.stdout.write(f"Bio: {bio}")
            else:
                self.stdout.write(
                    self.style.ERROR(f"❌ Failed to scrape @{username}: {result.get('error', 'Unknown error')}")
                )
        
        elif options['full_scrape']:
            username = options['full_scrape']
            posts_limit = options['posts_limit']
            
            self.stdout.write(f'🚀 Full scraping: @{username} (posts: {posts_limit})')
            
            result = scraper.full_profile_scrape(username, posts_limit)
            
            success = result.get('success', False)
            if 'scraping_summary' in result:
                success = result['scraping_summary'].get('success', False)
            
            if success:
                profile = result.get('profile', {})
                posts_data = result.get('posts', {})
                
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Full scrape completed for @{username}!')
                )
                
                # Profile summary
                self.stdout.write("📊 Profile Summary:")
                self.stdout.write(f"  • Full name: {profile.get('full_name', 'N/A')}")
                self.stdout.write(f"  • Followers: {profile.get('followers_count', 0):,}")
                self.stdout.write(f"  • Engagement rate: {profile.get('engagement_rate', 0):.2f}%")
                self.stdout.write(f"  • Category: {profile.get('category', 'N/A')}")
                
                # Posts summary
                posts = posts_data.get('posts', [])
                if posts:
                    self.stdout.write("📸 Posts Summary:")
                    self.stdout.write(f"  • Total scraped: {len(posts)}")
                    
                    total_likes = sum(p.get('likes_count', 0) for p in posts)
                    total_comments = sum(p.get('comments_count', 0) for p in posts)
                    avg_likes = total_likes // len(posts) if posts else 0
                    avg_comments = total_comments // len(posts) if posts else 0
                    
                    self.stdout.write(f"  • Average likes: {avg_likes:,}")
                    self.stdout.write(f"  • Average comments: {avg_comments:,}")
                    
                    # Show latest post
                    latest_post = posts[0]
                    self.stdout.write("📝 Latest Post:")
                    caption = latest_post.get('caption', '')
                    if caption and len(caption) > 100:
                        caption = caption[:100] + '...'
                    elif not caption:
                        caption = 'No caption'
                    
                    self.stdout.write(f"  • Caption: {caption}")
                    self.stdout.write(f"  • Likes: {latest_post.get('likes_count', 0):,}")
                    self.stdout.write(f"  • Comments: {latest_post.get('comments_count', 0):,}")
                    
                    hashtags = latest_post.get('hashtags', [])
                    if hashtags:
                        hashtag_str = '#' + ', #'.join(hashtags[:5])
                        self.stdout.write(f"  • Hashtags: {hashtag_str}")
            else:
                error_msg = result.get('error', 'Unknown error')
                self.stdout.write(
                    self.style.ERROR(f"❌ Full scrape failed for @{username}: {error_msg}")
                )
        
        else:
            self.stdout.write('Please specify an action:')
            self.stdout.write('  --test-connection       Test basic Instagram connection')
            self.stdout.write('  --scrape-profile USER    Scrape specific profile')
            self.stdout.write('  --full-scrape USER       Complete profile + posts scraping')
            self.stdout.write('')
            self.stdout.write('Examples:')
            self.stdout.write('  python manage.py test_scraping --test-connection')
            self.stdout.write('  python manage.py test_scraping --scrape-profile cristiano')
            self.stdout.write('  python manage.py test_scraping --full-scrape selenagomez --posts-limit 10')
