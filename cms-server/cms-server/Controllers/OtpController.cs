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
[HttpPost("verify-otp")]
    public IActionResult VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        try
        {
            var isValid = _otpService.VerifyOtp(request.PhoneNumber, request.Otp);
            if (isValid)
            {
                return Ok(new { message = "OTP verified successfully" });
            }
else
            {
                return BadRequest(new { error = "Invalid OTP" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "Failed to verify OTP", details = ex.Message });
        }
    }
// New endpoints for testing with default OTP "123456"
    [HttpPost("test/send-otp")]
    public IActionResult SendTestOtp([FromBody] SendOtpRequest request)
    {
        try
        {
            // Simulate sending the default OTP "123456"
            return Ok(new { message = "Test OTP '123456' sent successfully" });
        }
