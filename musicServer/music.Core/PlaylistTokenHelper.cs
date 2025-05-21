using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace music.Core
{
    public static class PlaylistTokenHelper
    {
        public static string GenerateSecureLink(int playlistId, string email, string baseUrl, string secretKey)
        {
            var encodedEmail = WebUtility.UrlEncode(email.ToLower());
            var dataToSign = $"{playlistId}:{encodedEmail}";
            var signature = GenerateSignature(dataToSign, secretKey);

            var token = $"{playlistId}:{encodedEmail}:{signature}";
            var base64Token = Convert.ToBase64String(Encoding.UTF8.GetBytes(token));
            return $"{baseUrl}/playlist/accept-share?token={base64Token}";
        }

        public static (int playlistId, string email, string signature)? ParseToken(string base64Token)
        {
            try
            {
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(base64Token));
                var parts = decoded.Split(':');
                if (parts.Length != 3) return null;

                var playlistId = int.Parse(parts[0]);
                var email = WebUtility.UrlDecode(parts[1]);
                var signature = parts[2];

                return (playlistId, email, signature);
            }
            catch
            {
                return null;
            }
        }

        public static bool IsValidSignature(int playlistId, string email, string signature, string secretKey)
        {
            var dataToSign = $"{playlistId}:{email.ToLower()}";
            var expectedSignature = GenerateSignature(dataToSign, secretKey);
            return signature == expectedSignature;
        }

        private static string GenerateSignature(string data, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var dataBytes = Encoding.UTF8.GetBytes(data);

            using var hmac = new HMACSHA256(keyBytes);
            var hash = hmac.ComputeHash(dataBytes);
            return Convert.ToBase64String(hash);
        }
    }

}
