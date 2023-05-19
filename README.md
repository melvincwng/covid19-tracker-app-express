# covid19-tracker-app-express

This is the backend application which I built using Express/Node.js and MongoDB/Mongoose.

It is used as one of the APIs for [Covid19-SG](https://github.com/melvincwng/covid19-tracker-app).

## Important Note

Using 0.0.0.0/0 for the IP Whitelist on MongoDB Atlas is **NOT RECOMMENDED**, 

Instead, an alternative solution could be to use QuotaGuard Static IP Address to whitelist the IP address for the outbound traffic from the Express/Node.js application to MongoDB Atlas.

This is recommended because 0.0.0.0/0 makes your DB publicly accessible, and hence vulnerable to attacks.

Please refer to the [References](#references) section for more information.

## References:

1. [Deploying MongoDB on Heroku](https://www.mongodb.com/developer/products/atlas/use-atlas-on-heroku/#configuring-heroku-ip-addresses-in-mongodb-atlas)
2. [QuotaGuard Heroku Plugin that allows you to route inbound/outbound traffic through a static IP address that is whitelisted on your MongoDB Atlas cluster](https://www.quotaguard.com/docs/language-platform/mongo-db/connect-mongodb-static-ip/)
3. [QuotaGuard Dashboard to view your Request & Bandwidth usage](https://www.quotaguard.com/dashboard/)
4. [MongoDB Documentation on IP Whitelist](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
5. [MongoDB Security Checklist - Limit Network Exposure](https://www.mongodb.com/docs/manual/administration/security-checklist/#arrow-limit-network-exposure)
6. [MongoDB Forums](https://www.mongodb.com/community/forums/t/securing-a-0-0-0-0-database/181052)
