namespace cms_server.DTOs
{
    public class ContractDetailDto
    {
        public string? CustomerName { get; set; }
        public string? CustomerEmail { get; set; }
        public string? CustomerPhone { get; set; }
        public string? CustomerCitizenID { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CitizenIdsupplier { get; set; }
        public DateOnly? CitizenIdissuanceDate { get; set; }
        public string DeceasedName { get; set; } = null!;
        public string? DeceasedCitizenID { get; set; }
        public DateOnly? DeceasedDateOfBirth { get; set; }
        public DateOnly? DeceasedDateOfDeath { get; set; }
        public string? DeceasedDeathCertificateNumber { get; set; }
        public string? DeceasedDeathCertificateSupplier { get; set; }
        public string? DeceasedRelationshipWithCustomer { get; set; }
        public int ContractId { get; set; }
        public int CustomerId { get; set; }
        public int StaffId { get; set; }
        public string StaffName { get; set; } = null!;
        public int NicheId { get; set; }
        public string? NicheName { get; set; }
        public string? NicheCode { get; set; }

        public int? DeceasedId { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Status { get; set; }
        public string? Note { get; set; }
        public string ContractCode { get; set; } = null!;
        public decimal? TotalAmount { get; set; }
        // Thêm thuộc tính Duration
        public string? Duration
        {
            get
            {
                if (!EndDate.HasValue)
                {
                    return null;
                }

                var start = new DateTime(StartDate.Year, StartDate.Month, StartDate.Day);
                var end = new DateTime(EndDate.Value.Year, EndDate.Value.Month, EndDate.Value.Day);

                int months = ((end.Year - start.Year) * 12) + end.Month - start.Month;
                if (end.Day < start.Day)
                {
                    months--;
                }

                int years = months / 12;
                months %= 12;

                string duration = "";
                if (years > 0)
                {
                    duration += $"{years} năm ";
                }
                if (months > 0)
                {
                    duration += $"{months} tháng";
                }

                return duration.Trim();
            }
        }

    }
    public class ContractDto
    {
        public int ContractId { get; set; }
        public int NicheId { get; set; }
        public string NicheName { get; set; } = null!;

        public string ContractCode { get; set; } = null!;
        public string CustomerName { get; set; } = null!;
        public string DeceasedName { get; set; } = null!;
        public string? DeceasedRelationshipWithCustomer { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string? Status { get; set; }

        // Thêm thuộc tính Duration
        public string? Duration
        {
            get
            {
                if (!EndDate.HasValue)
                {
                    return null;
                }

                var start = new DateTime(StartDate.Year, StartDate.Month, StartDate.Day);
                var end = new DateTime(EndDate.Value.Year, EndDate.Value.Month, EndDate.Value.Day);

                int months = ((end.Year - start.Year) * 12) + end.Month - start.Month;
                if (end.Day < start.Day)
                {
                    months--;
                }

                int years = months / 12;
                months %= 12;

                string duration = "";
                if (years > 0)
                {
                    duration += $"{years} năm ";
                }
                if (months > 0)
                {
                    duration += $"{months} tháng";
                }

                return duration.Trim();
            }
        }
    }




}
