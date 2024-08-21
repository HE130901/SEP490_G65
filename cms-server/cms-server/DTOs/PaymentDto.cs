namespace cms_server.DTOs
{
    public class PaymentRequestModel
    {
        public string Amount { get; set; }
        public string OrderId { get; set; }
    }

    public class PaymentResponseModel
    {
        public string PaymentUrl { get; set; }
    }
}
