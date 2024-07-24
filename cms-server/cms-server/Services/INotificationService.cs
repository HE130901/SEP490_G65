using cms_server.Models;

namespace cms_server.Services
{
    public interface INotificationService
    {
        Task SendNotificationAsync(Notification notification);
    }
}
