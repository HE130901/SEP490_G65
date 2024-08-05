using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class OtpController : ControllerBase
{
    private readonly IOtpService _otpService;

    public OtpController(IOtpService otpService)
    {
        _otpService = otpService;
    }

 [HttpPost("send-otp")]
    public IActionResult SendOtp([FromBody] SendOtpRequest request)
    {
        try
        {
            _otpService.SendOtp(request.PhoneNumber);
            return Ok(new { message = "OTP sent successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to send OTP", details = ex.Message });
        }
    }