using cms_server.Models;

namespace cms_server.DTOs
{
    // DTO and Request classes
    public class ServiceOrderResponse
    {
        public string ServiceOrderCode { get; set; }
        public List<ServiceOrderDetail> ServiceOrderDetails { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class ServiceOrderDetailsResponse
    {
        public string ServiceOrderCode { get; set; }
        public string CustomerFullName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public NicheInfo Niche { get; set; }
        public decimal TotalPrice { get; set; }
        public string? CompletedBy { get; set; }
        public DateTime? CompletedDate { get; set; }
        public List<ServiceOrderDetail> ServiceOrderDetails { get; set; }
    }

    public class NicheInfo
    {
        public string Building { get; set; }
        public string Floor { get; set; }
        public string Area { get; set; }
        public string NicheName { get; set; }
    }

    public class UpdateCompletionImageRequest
    {
        public int ServiceOrderDetailID { get; set; }
        public string CompletionImage { get; set; }
    }

    public class CreateServiceOrderRequest
    {
        public int CustomerID { get; set; }
        public int NicheID { get; set; }
        public DateTime OrderDate { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }

    public class ServiceOrderDetailRequest
    {
        public int ServiceID { get; set; }
        public int Quantity { get; set; }
    }

    public class AddServiceToOrderRequest
    {
        public int ServiceOrderID { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }

    public class ServiceOrderForStaffDto
    {
        public int ServiceOrderId { get; set; }
        public string ServiceOrderCode { get; set; }
        public List<ServiceOrderDetailDto> ServiceOrderDetails { get; set; }
        public decimal TotalPrice { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
    }

    public class ServiceOrderDetailDto
    {
        public int ServiceOrderDetailId { get; set; }
        public int ServiceOrderId { get; set; }
        public int ServiceId { get; set; }
        public string ServiceName { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; }
        public string? CompletionImage { get; set; }
    }

    public class ServiceOrderResponseForStaffDto
    {
        public int ServiceOrderId { get; set; }
        public string NicheAddress { get; set; }
        public string CustomerName { get; set; }
        public string ServiceOrderCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public List<ServiceOrderDetailDto> ServiceOrderDetails { get; set; }
    }


    public class ServiceOrderDto
    {
        public int CustomerId { get; set; }
        public int NicheId { get; set; }
        public DateTime OrderDate { get; set; }
        public string? ServiceList { get; set; }
    }

    public class ServiceOrderResponseDto
    {
        public int ServiceOrderId { get; set; }
        public string? NicheAddress { get; set; }
        public string? DeceasedName { get; set; }
        public string? ServiceOrderCode { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? OrderDate { get; set; }
        public string? CompletedBy { get; set; }
        public DateTime? CompletedDate { get; set; }
        public List<ServiceOrderDetailResponseDto> ServiceOrderDetails { get; set; } = new List<ServiceOrderDetailResponseDto>();
    }

    public class ServiceOrderDetailResponseDto
    {
        public string ServiceName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? CompletionImage { get; set; }
        public string? Status { get; set; }
    }

    public class CreateServiceOrderForStaff
    {
        public int NicheID { get; set; }
        public DateTime OrderDate { get; set; }
        public List<ServiceOrderDetailRequest> ServiceOrderDetails { get; set; }
    }

    public class UpdateServiceOrderRequest
    {
        public int ServiceOrderId { get; set; }
        public DateTime OrderDate { get; set; }
    }
}
