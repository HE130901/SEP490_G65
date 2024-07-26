﻿using cms_server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using cms_server.DTOs;

namespace cms_server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContractForStaffController : ControllerBase
    {
        private readonly CmsContext _context;

        public ContractForStaffController(CmsContext context)
        {
            _context = context;
        }

        private async Task<bool> IsDuplicateDeathCertificateNumberAsync(string deathCertificateNumber)
        {
            return await _context.Deceaseds.AnyAsync(d => d.DeathCertificateNumber == deathCertificateNumber);
        }

        [HttpPost("create-contract")]
        public async Task<IActionResult> CreateContract(CreateContractRequest request)
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var niche = await _context.Niches
                        .FirstOrDefaultAsync(n => n.NicheId == request.NicheID && n.Status == "Available");

                    if (niche == null)
                    {
                        return BadRequest("Selected niche is not available.");
                    }

                    var customer = await _context.Customers
                        .FirstOrDefaultAsync(c => c.CitizenId == request.CustomerCitizenId);

                    if (customer == null)
                    {
                        // Create and add new customer
                        customer = new Customer
                        {
                            FullName = request.CustomerFullName,
                            Phone = request.CustomerPhoneNumber,
                            Email = request.CustomerEmail,
                            Address = request.CustomerAddress,
                            CitizenId = request.CustomerCitizenId,
                            CitizenIdissuanceDate = request.CustomerCitizenIdIssueDate,
                            CitizenIdsupplier = request.CustomerCitizenIdSupplier,
                            // Default password is "abcdabcd"
                            PasswordHash = "$2a$11$nUOFWiAMFi4zIAbIkYAbcuhFx3JYvT4ELKpBE6kh7IN5S9/wsfk4q"
                        };
                        _context.Customers.Add(customer);
                        await _context.SaveChangesAsync();
                    }

                    bool isDuplicateDeathCertificate = await IsDuplicateDeathCertificateNumberAsync(request.DeathCertificateNumber);
                    if (isDuplicateDeathCertificate)
                    {
                        return BadRequest("Đã có người mất đăng ký với số giấy chứng tử này!");
                    }

                    var deceased = new Deceased
                    {
                        FullName = request.DeceasedFullName,
                        DateOfBirth = request.DeceasedDateOfBirth,
                        DateOfDeath = request.DeceasedDateOfDeath,
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeathCertificateNumber = request.DeathCertificateNumber,
                        DeathCertificateSupplier = request.DeathCertificateSupplier,
                        CitizenId = request.DeceasedCitizenId,
                        RelationshipWithCusomer = request.RelationshipWithCustomer
                    };
                    _context.Deceaseds.Add(deceased);
                    await _context.SaveChangesAsync();

                    // Generate ContractCode
                    var today = DateOnly.FromDateTime(DateTime.Now);
                    var dateStr = today.ToString("yyyyMMdd");

                    var contractsTodayCount = await _context.Contracts.CountAsync(c => c.StartDate == today);
                    var contractNumber = (contractsTodayCount + 1).ToString("D3"); // Pads with zeros to 3 digits
                    var contractCode = $"HD-{dateStr}-{contractNumber}";

                    var contract = new Contract
                    {
                        ContractCode = contractCode,
                        CustomerId = customer.CustomerId,
                        StaffId = request.StaffID,
                        NicheId = niche.NicheId,
                        DeceasedId = deceased.DeceasedId,
                        StartDate = request.StartDate,
                        EndDate = request.EndDate,
                        Status = "Active",
                        Note = request.Note,
                        TotalAmount = request.TotalAmount
                    };
                    _context.Contracts.Add(contract);
                    await _context.SaveChangesAsync();

                    niche.Status = "Unavailable";
                    niche.CustomerId = customer.CustomerId;
                    niche.DeceasedId = deceased.DeceasedId;
                    _context.Niches.Update(niche);
                    await _context.SaveChangesAsync();

                    var nicheHistory = new NicheHistory
                    {
                        NicheId = niche.NicheId,
                        CustomerId = customer.CustomerId,
                        DeceasedId = deceased.DeceasedId,
                        ContractId = contract.ContractId,
                        StartDate = contract.StartDate,
                        EndDate = contract.EndDate
                    };
                    _context.NicheHistories.Add(nicheHistory);
                    await _context.SaveChangesAsync();

                    await transaction.CommitAsync();

                    return Ok(contract);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    // Log the error (consider using a logging framework like Serilog)
                    var innerExceptionMessage = ex.InnerException?.Message;
                    var detailedErrorMessage = $"Error: {ex.Message}, Inner Exception: {innerExceptionMessage}";
                    return StatusCode(500, detailedErrorMessage);
                }
            }
        }

        // New method to get all contracts
        [HttpGet("all-contracts")]
        public async Task<IActionResult> GetAllContracts()
        {
            var contracts = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)

                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheId = c.NicheId,
                    CustomerId = c.CustomerId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-Ô {c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    ContractCode = c.ContractCode
                })
                .ToListAsync();
            return Ok(contracts);
        }

        // New method to get details of a specific contract by ID
        [HttpGet("contract/{id}")]
        public async Task<IActionResult> GetContractById(int id)
        {
            var contract = await _context.Contracts
                .Include(c => c.Customer)
                .Include(c => c.Deceased)
                .Include(c => c.Niche)
                .Select(c => new ContractForStaffDto
                {
                    ContractId = c.ContractId,
                    NicheAddress = $"{c.Niche.Area.Floor.Building.BuildingName}-{c.Niche.Area.Floor.FloorName}-{c.Niche.Area.AreaName}-{c.Niche.NicheName}",
                    CustomerName = c.Customer.FullName,
                    StartDate = c.StartDate,
                    EndDate = c.EndDate,
                    Status = c.Status,
                    ContractCode = c.ContractCode
                })
                .FirstOrDefaultAsync(c => c.ContractId == id);

            if (contract == null)
            {
                return NotFound();
            }

            return Ok(contract);
        }


        [HttpPost("renew-contract")]
        public async Task<IActionResult> RenewContract(int contractId, DateOnly newEndDate, decimal totalAmount)
        {
            var contract = await _context.Contracts
                .Include(c => c.ContractRenews)
                .FirstOrDefaultAsync(c => c.ContractId == contractId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            // Update the existing contract status to "Extended"
            contract.Status = "Extended";
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();

            // Create a new ContractRenew entry
            int renewalCount = contract.ContractRenews.Count + 1;
            string renewalCode = GenerateRenewalCode(contract.ContractCode, renewalCount);

            var contractRenew = new ContractRenew
            {
                ContractId = contract.ContractId,
                ContractRenewCode = renewalCode,
                Status = "Active",
                CreatedDate = DateOnly.FromDateTime(DateTime.UtcNow),
                EndDate = newEndDate,
                TotalAmount = totalAmount,
                Note = "Gia hạn "+contract.ContractCode
            };
            _context.ContractRenews.Add(contractRenew);
            await _context.SaveChangesAsync();

            return Ok(contractRenew);
        }


        private string GenerateRenewalCode(string contractCode, int renewalCount)
        {
            // Extract the date part and suffix from the contract code
            var parts = contractCode.Split('-');
            if (parts.Length != 3)
            {
                throw new InvalidOperationException("Invalid contract code format.");
            }

            string datePart = parts[1]; // e.g., "20220725"
            string suffix = parts[2]; // e.g., "001"

            // Format the renewal code
            return $"GH{renewalCount:D2}-{datePart}-{suffix}";
        }

        [HttpPost("cancel-contract")]
        public async Task<IActionResult> CancelContract(int contractId, string note)
        {
            var contract = await _context.Contracts
                .FirstOrDefaultAsync(c => c.ContractId == contractId);

            if (contract == null)
            {
                return NotFound("Contract not found.");
            }

            // Update contract status to 
            contract.Status = "Canceled";
            contract.Note = note;
            _context.Contracts.Update(contract);
            await _context.SaveChangesAsync();

            return NoContent();
        }   



    }

    public class CreateContractRequest
    {
        public string CustomerFullName { get; set; }
        public string? ContractCode { get; set; }
        public string? CustomerPhoneNumber { get; set; }
        public string CustomerEmail { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerCitizenId { get; set; }
        public DateOnly? CustomerCitizenIdIssueDate { get; set; }
        public string? CustomerCitizenIdSupplier { get; set; }
        public string DeceasedFullName { get; set; }
        public string? DeceasedCitizenId { get; set; }
        public DateOnly? DeceasedDateOfBirth { get; set; }
        public DateOnly? DeceasedDateOfDeath { get; set; }
        public string? DeathCertificateNumber { get; set; }
        public string? DeathCertificateSupplier { get; set; }
        public string? RelationshipWithCustomer { get; set; }
        public int? NicheID { get; set; }
        public int StaffID { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Note { get; set; }
        public decimal TotalAmount { get; set; }
    }


public class ContractForStaffDto
    {
        public int ContractId { get; set; }
        public int NicheId { get; set; }
        public int CustomerId { get; set; }
        public string NicheAddress { get; set; }
        public string CustomerName { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public string Status { get; set; }
        public string ContractCode { get; set; }

    }
}
