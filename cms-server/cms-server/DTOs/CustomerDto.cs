namespace cms_server.DTOs
{
    public class CustomerDto1
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CitizenId { get; set; }
        public DateOnly? CitizenIdissuanceDate { get; set; }
        public string CitizenIdsupplier { get; set; }
    }

    public class UpdateCustomerDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CitizenId { get; set; }
        public DateOnly? CitizenIdissuanceDate { get; set; }
        public string CitizenIdsupplier { get; set; }
    }

    public class ChangePasswordDto2
    {
        public string Password { get; set; }
    }

    public class CustomerDto
    {
        public int CustomerId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CitizenId { get; set; }
    }
}
