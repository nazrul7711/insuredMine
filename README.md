# insuredMine

In this assignment I have made following 7 schemas

1. Post - for posting the csv data into our database
2. Account - Here I have presumed that we have user's account where we can have multiple users. In this schema I have included password, account_name, account_type, policy: policy is array of policy objects , user: user is array of user objects
3. User - User is unique and in this schema I included users personal details like email, phone, firstname , city, address, state, zip, dob, his individual policy, gender, csr, userType and account_name which is referecing to the account object id which we will get after the account id created
4. Policy - policy is unique and here I have included agent:referecing agent object, policy_mode, policy_number, premium_amt_written, policy_type, account_name: reference to the account object, policy_start_date, policy_end_date, premium_amount.
5. Lob - lob contains a single parameter category_name
6. Carrier - carrier has two fields his line of business: this field will reference lob object and and carrier name
7. Agent - Agent schema has agent, producer, agency_id, has_active_client and policy: this field is a array containing policy objects

Following is the approach I had while building this project:

1. First we will create an account and this account will have empty arrays as values for policy and user, later on when we will create user and policy while updating these accounts we can add policy and user to these arrays. While pushing policy or user we will pass single policy or user and we will see if the user or policy if they exist then we will remove them from the array or we will push them.

2. After creation of account we can make policy and user documents.

3. All routes except account creation and user creation are protected . We assume only account holder can make CRUD operation on these documents.

4. Here apart from the CRUD endpoints for the User, Account and Policy . I have made endpoints for the Agent , Lob, Carrier. In Agent I have made one api for the Agent creation and one for the Agent updation as while creating agent agent will not have any policies and later on for policy updation we need another api.
