/* Reason for having separate table for Course Registration
   As there is M:N relationship between the Students and Courses
   that is a student can join more than one courses and A course can  
   be taken by more than one students
 
   Thus, As per the Database Mangement Principle we need to separete table
   for it

   BluePrint: ---> 
{
    courseId: [...usernames]
}
*/
// Some predefined Datas

let courseRegs = {
    'CSE1001': ["shashwat", "suyash", "ishu"],
    'CSE1002': ["shashwat", "suyash"],
    'CSE1003': ["shashwat", "suyash", "ishu"]
}
