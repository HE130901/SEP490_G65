using cms_server.Configuration;
using cms_server.Models;

namespace cms_server.Services
{
    public class NotificationService : INotificationService
    {
        private readonly CmsContext _context;

        public NotificationService(CmsContext context)
        {
            _context = context;
        }

        public async Task SendNotificationAsync(Notification notification)
        {
            // Save the notification to the database
            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }
    }
}
