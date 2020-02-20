## Database Schema

#### Blueprint for users
 Since username is primary key
    username: {
        name: String
        password: String 
        userType: enumTupe
    }
#### Blueprint of the invitation table
[
    { 
        sentTo: {ref} username , 
        sentBy: {ref} username, 
        courseId: {ref} course,
        status: PENDING || ACCEPTED
]


#### Blueprint of Courses

Attributes
1. CourseID [Primary Key] {String} {RegEx : [A-Z]{3}[1-9][0-9]{3} }
2. Name {String} {min: 4}
3. isEnabled {Boolean} default: true
4. duration {Number} in hrs
5. author {ref username }
7. limit {Number} {min 5} {allowed null}
8. content {String} Content of the course     

#### Blueprint for collaboration
{
    courseId: [...usernames]
}


#### Blueprint for CourseRegistratons
{
    courseId: [...usernames]
}
