# Web Dev Starter Code

## Project Spec

### Theme
I am feeling very indecisive about this project in general so I have come up with two ideas.
Essentially the structure for both ideas will be the same, it is just the functionality that
will differ so I think a pivot at any point in time will be relatively simple. I wanted to create
something that essentially I could see myself using to manage simple workflows and landed on two options.
The first is a basic finance tracker/budgeting tool (I still use google sheets :)), and the second
is a Canvas Assignment to do/grade tracker (the native Canvas dashboard doesn't work well for me as I work in
Canvas, have numerous enrollments and it's impossible to keep it clean even with removing notifications and the like).
I'm not sure how I will use the AWS Backend and Dynamo DB right now to dynamically retrive data from Canvas
so it would probably be more static/dummy data for now if this route were chosen.

A sample structure of each idea is provided below in the functionality section.

### Functionality

#### Idea 1 - Personal Finance Tracker/budget tool
This will be as it sounds, a basic finance tracker with a few functions. There will be a standard login 
page (to start this will just take a basic user/password and stretch goals will add actual functionality).
There will be 3 additional pages. A page to view your budget (with export options), and page to enter
transactions and expenditures, and a possibly dashboard/savings/future looking option.

#### Idea 2 - Canvas Assignment display/todo
Just like idea one, the pages will be the same however page one will show current assignments,
page 2 will allow a user to enter the assignments they want to work on (or mark other assignments as completed)
and page 3 will show forward planning for future assignments, classes, or projects.

### Target Audience
The target audience is me! Kidding, only a bit. It is actually myself, but in also extends to any 
student or individual who is looking towards 1) Finance Tracking beyond a spreadsheet or one of the many
applications out, something simple with just enough of the basic features to do what you need, and safe local storage of said 
data.

OR 2) students/teachers/workers who utilize Canvas and find the to-do menu/assignments menu a bit bothersome
with too much info. These individuals would prefer a clean easy to see task manager that shows what needs to be done,
what grades were received, and what might be coming up. 

Essentially this is for anyone who wants a simplistic planner!

### Data
This is the more complicated part. The finance tracker is easy, it will manage some
dummy transactions just to be functional, but allow a user to add, edit, and close out
transactions (post them to their budget). It may have a checkings/savings tracker and/or
just a general budget tracker that allows them to keep track of where they are at that point in the
month/year. It will have export functionality, and it should allow for a nice dashboard esque display summary
that shows current funds, recent transactions, and progress towards goals.

In looking at the Canvas Assignments piece, this will be trickier. This will hold either API called data
from my own canvas instance (I might create a dummy sandbox course to not expose my own personal data).
That data will be a list of currently enrolled courses, maybe prior enrollments, and then the corresponding
assignments/grades for these courses. It will allow users to mark a course and/or assignment as open, in-progress,
or completed. It will also have export functionality, and it should also allow a nice dashboard however this 
would show current grades, remaining assignments, and progress towards completing the semester.

### Stretch Goals
Stretch goals are to: Allow additionally functionality like a true login page that encrypts user data and 
returns a specific user instance once logged in. This would be a bit to enable but might be fund.

Additionally, a prettier dashboard with graphics, charts, etc. Maybe even update the entry tables
from simple tables to something more Kanban style, drag and drop functionality.

Final stretch goal would be to host the basic version somewhere like netlify, heroku, railway, etc
so that users could access it from this class without cloning the repo and running it locally.

## Project Wireframe


![wireframe](wireframe-example.png)
