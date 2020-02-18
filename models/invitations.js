const InviteStatus = require('../const').INVITE_STATUS;
/*
    Blueprint of the invitation table
    [
        { 
            sentTo: {ref} username , 
            sentBy: {ref} username, 
            courseId: {ref} course,
            status: PENDING || ACCEPTED
    ]
*/

let invitation = [
    {
        sentTo: 'silber',
        sentBy: 'andrew',
        courseId: 'CSE1003',
        status: InviteStatus.PENDING
    },
    {
        sentTo: 'root',
        sentBy: 'andrew',
        courseId: 'CSE1003',
        status: InviteStatus.ACCEPTED
    },
    {
        sentTo: 'silber',
        sentBy: 'root',
        courseId: 'CSE1001',
        status: InviteStatus.PENDING
    },

]

module.exports = invitation