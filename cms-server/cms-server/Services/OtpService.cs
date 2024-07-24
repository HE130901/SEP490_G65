using System;
using System.Collections.Concurrent;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

public interface IOtpService
{
    void SendOtp(string phoneNumber);
    bool VerifyOtp(string phoneNumber, string otp);
}

public class OtpService : IOtpService
{
    private readonly ConcurrentDictionary<string, string> _otpStore = new();
    private readonly string _twilioAccountSid;
    private readonly string _twilioAuthToken;
    private readonly string _twilioPhoneNumber;

    public OtpService(IConfiguration configuration)
    {
        _twilioAccountSid = configuration["Twilio:AccountSid"];
        _twilioAuthToken = configuration["Twilio:AuthToken"];
        _twilioPhoneNumber = configuration["Twilio:PhoneNumber"];
        TwilioClient.Init(_twilioAccountSid, _twilioAuthToken);
    }

    public void SendOtp(string phoneNumber)
    {
        var otp = new Random().Next(100000, 999999).ToString();
        _otpStore[phoneNumber] = otp;

        var message = MessageResource.Create(
            body: $"Your OTP code is {otp}",
            from: new PhoneNumber(_twilioPhoneNumber),
            to: new PhoneNumber(phoneNumber)
        );
    }

    public bool VerifyOtp(string phoneNumber, string otp)
    {
        return _otpStore.TryGetValue(phoneNumber, out var storedOtp) && storedOtp == otp;
    }
}
