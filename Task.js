// MongoDB Task

// 1. Find all the topics and tasks which are thought in the month of October

db.topics.find({ date: { $regex: '2020-10' } });
db.tasks.find({ date: { $regex: '2020-10' } });

// 2. Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

db.companydrives.find({ drivedate: { $gte: '2020-10-15', $lte: '2020-10-31' } });

// 3. Find all the company drives and students who are appeared for the placement.

const drive = db.companydrives.find({}).toArray();
const email = [];
drive.forEach((ele) => ele.students.forEach((ip) => email.push(ip)));
db.users.find({ email: { $in: email } }, { name: 1 });


// 4. Find the number of problems solved by the user in codekata

db.codekata.aggregate([
  {
    $group: {
      _id: "",
      Num_of_problem_solved : {
        $sum: "$solvedcount",
      },
    },
  },
]);


// 5. Find all the mentors with who has the mentee's count more than 15


db.users.aggregate([
  {
    $group: {
      _id: "$mentor.name",
      noOfMentee: {
        $sum: 1,
      },
    },
  },
  {
    $project: {
      _id: 0,
      mentor: "$_id",
      noOfMentee: 1,
    },
  },
  {
    $match: {
      noOfMentee: { $gt: 15 }
    }
  }
]);


// 6. Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020


db.attendance.aggregate([
  {
    $match: {
      date: { $gte: "2020-10-15", $lte: "2020-10-31" }, 
      isPresent: false 
    }
  },
  {
    $lookup: {
      from: "tasks", 
      let: { attendance_date: "$date" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$task_date", "$$attendance_date"] }, 
                { $eq: ["$isSubmitted", false] } 
              ]
            }
          }
        }
      ],
      as: "unsubmittedTasks" 
    }
  },
  {
    $match: {
      "unsubmittedTasks": { $exists: true, $not: { $size: 0 } } 
    }
  },
  {
    $group: {
      _id: null, 
      No_of_users: { $sum: 1 } 
    }
  },
  {
    $project: {
      _id: 0,
      No_of_users: 1,
    },
  }
]);


