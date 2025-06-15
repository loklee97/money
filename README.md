This is just a small individual project for self use and also  provide for interview.
Main purpose is just to record daily expenses and income and thats all.
Its basically use typescript and react for frontend with tailwind css which link to vercel and dynamo db with express as api which i have split to another git https://github.com/loklee97/refactored-eureka and link to render.com.

This website I will use myself too, so that i am using all free version package including vercel and render.Please forgive me about that,so if you using it and cant login please wait for few minute because free version of render will shutdown if 20+minute no request then wait few minutes to warm up.

Important before using 
1.Free version render will need a few minute to warm up,so please be patience on waiting for it.
2.This website function basically just add expenses record and income record then it will calculate total money on header which also can hide and show.
3.If your total money got problem can click recalculate to recalculate base on all records again.
4.It also can contra if you borrow money to ppl then he pay back to you by using parent record. So it has a balanced column on record list page when there is child record to figure out is there anyone still not pay money back to you.
5.Category is hardcoded cause to avoid database data disappeared make error like category code c-01 is deleted but record that using c-01 will show error.So if there is no category suitable for you can try other(+) and other(-).
6.Dashboard can clearly see which type of category cost the most or earn the most la.

Database
- basically database structure is filter by type such as record and user.
- id is the partition key and reatedDate is the sort key
- every record will seperate by each user which mean can be more than 1 user.

