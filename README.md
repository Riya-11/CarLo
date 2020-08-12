### Introduction
CarLo is a mobile application where vehicle owners can post the details and availability of their vehicle which in turn, can be rented by users who are looking for rental vehicles for a few days. Through this application, people who don’t use their cars very frequently can make some easy money. This can act as an alternative to conventional car rental agencies.

### Features - 

#### 1. User Profile Management
Developed an authentication system where - 
New users can register
Existing users can log in using their credentials (using OAuth and normal signin)
User can view host’s cars, their location on maps, ratings on host’s profile.

#### 2. Search
Developed search module with following functionalities - 
Searching for cars on the basis of Availability, Location
Users can filter results based on Seating Capacity
Map to pin-point the location of all cars.


#### 3. Booking
Developed booking module with the following functionalities  - 
View details of selected car
View host and car reviews
View contact information of host
View Trip Charge (based on number of days, pricing of the car)
Select delivery mode - self-pickup / delivery by executive 

#### 4. Host Side
Developed a module that can handle the following requests-
User can list his car for renting
The host of the car can view his ratings,reviews,etc.
The host can view who booked his car and other trip details
Map to pin-point the car location.
The host receives monetary benefits for renting his car.


#### 5. Rate and Review
Developed a module to handle the following - 
User can rate the car, the host and write a review for the same.
Rating of respective user will be visible on their profile.

#### 6. Trips
API for viewing active and past bookings and to view notifications regarding new bookings.

#### 7. Payment
API for accessing the payment gateway for completing transactions.
APIs Developed: 
https://api.stripe.com/v1/tokens - to access the Stripe Payment Gateway and acquire the transaction ID.

#### 8. Delivery
An executive is assigned for each trip if the customer opts for delivery.


### Instructions to run - 
Below commands work on Linux based systems. Suitable alternatives can be found for Windows as well.

- Install MongoDB. Detailed instructions can be found here: (https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
- To run MongoDB-
    - sudo service mongod start
- Install npm (Node Package Manager)
    - sudo apt update
    - sudo apt install nodejs
    - sudo apt install npm
    - nodejs -v (To check version)
 - “cd” into the project directory where “package.json” is present and run the following command- 
     - npm install
	  The above command will install all necessary dependencies for the project.
 - To launch the project, run-
      - node app.js
