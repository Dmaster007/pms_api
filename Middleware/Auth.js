const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const User = require("../Models/User");
// Initialize a JWKS client instance
const client = jwksClient({
  jwksUri: "https://dev-n1lb40exoxfu2fwu.us.auth0.com/.well-known/jwks.json", // Auth0 JWKS endpoint
});

// Function to retrieve RSA public key from JWKS
const getPublicKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

const authMiddleware = async (req, res, next) => {

  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Authorization denied. Token not provided." });
  }

  try {
    jwt.verify(
      token,
      getPublicKey,
      {
        algorithms: ["RS256"],
        issuer: "https://dev-n1lb40exoxfu2fwu.us.auth0.com/",
        audience: "BvXEhZ8flXDPnd2H3NLkk7B7RQvCyS2N",
      },
      async (err, decoded) => {
        if (err) {
          console.error("JWT Verification Error:", err);
          return res
            .status(401)
            .json({ message: "Authorization denied. Invalid token." });
        }

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
          return res
            .status(401)
            .json({ message: "Authorization denied. User not found." });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = authMiddleware;
