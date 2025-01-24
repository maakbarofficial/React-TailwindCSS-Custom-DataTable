import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

export const data = {
  Name: {
    values: [
      "John Doe",
      "Jane Smith",
      "Sam Johnson",
      "Alice Brown",
      "Bob White",
      "Jack Nilson",
      "Emily Davis",
      "Michael Green",
      "Sophia Turner",
      "David Lee",
      "Olivia Harris",
      "Matthew Clark",
      "Emma Martinez",
      "William Taylor",
      "Isabella Garcia",
      "James Wilson",
      "Oliver Anderson",
      "Sophie Martinez",
      "Benjamin Thompson",
      "Charlotte Moore",
    ],
  },
  Age: {
    values: [
      "28",
      "34",
      "45",
      "29",
      "40",
      "40",
      "32",
      "26",
      "38",
      "31",
      "30",
      "27",
      "33",
      "44",
      "28",
      "39",
      "39",
      "25",
      "36",
      "37",
    ],
  },
  Email: {
    values: [
      "john.doe@example.com",
      "jane.smith@example.com",
      "sam.johnson@example.com",
      "alice.brown@example.com",
      "bob.white@example.com",
      "jack.nilson@example.com",
      "emily.davis@example.com",
      "michael.green@example.com",
      "sophia.turner@example.com",
      "david.lee@example.com",
      "olivia.harris@example.com",
      "matthew.clark@example.com",
      "emma.martinez@example.com",
      "william.taylor@example.com",
      "isabella.garcia@example.com",
      "james.wilson@example.com",
      "oliver.anderson@example.com",
      "sophie.martinez@example.com",
      "benjamin.thompson@example.com",
      "charlotte.moore@example.com",
    ],
  },
  Role: {
    values: [
      "CEO",
      "CTO",
      "Admin",
      "Client",
      "Designer",
      "Director",
      "Developer",
      "Producer",
      "Designer",
      "Publisher",
      "QA",
      "Manager",
      "Engineer",
      "Artist",
      "Writer",
      "Analyst",
      "Architect",
      "Musician",
      "Consultant",
      "Lawyer",
    ],
  },
  Salary: {
    values: [
      25000, 13000, 7200, 6850, 9100, 8500, 7900, 10400, 5480, 9150, 3200,
      12500, 8000, 6000, 7400, 8200, 9500, 8800, 7200, 11000,
    ],
  },
  Active: {
    values: [
      false,
      true,
      false,
      true,
      false,
      true,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
      true,
      false,
    ],
  },
};








// Example if there is any conditional rendering in data
// import { IoCheckmarkOutline, IoCloseOutline } from "react-icons/io5";

// export const data = {
//   Name: {
//     values: [
//       "John Doe",
//       "Jane Smith",
//       "Sam Johnson",
//       "Alice Brown",
//       "Bob White",
//       "Jack Nilson",
//       "Emily Davis",
//       "Michael Green",
//       "Sophia Turner",
//       "David Lee",
//       "Olivia Harris",
//       "Matthew Clark",
//       "Emma Martinez",
//       "William Taylor",
//       "Isabella Garcia",
//       "James Wilson",
//       "Oliver Anderson",
//       "Sophie Martinez",
//       "Benjamin Thompson",
//       "Charlotte Moore",
//     ],
//     classNames: (value) =>
//       value === "Jane Smith" || value === "Emma Martinez"
//         ? "text-green-400 font-medium"
//         : "text-white",
//   },
//   Age: {
//     values: [
//       "28",
//       "34",
//       "45",
//       "29",
//       "40",
//       "40",
//       "32",
//       "26",
//       "38",
//       "31",
//       "30",
//       "27",
//       "33",
//       "44",
//       "28",
//       "39",
//       "39",
//       "25",
//       "36",
//       "37",
//     ],
//   },
//   Email: {
//     values: [
//       "john.doe@example.com",
//       "jane.smith@example.com",
//       "sam.johnson@example.com",
//       "alice.brown@example.com",
//       "bob.white@example.com",
//       "jack.nilson@example.com",
//       "emily.davis@example.com",
//       "michael.green@example.com",
//       "sophia.turner@example.com",
//       "david.lee@example.com",
//       "olivia.harris@example.com",
//       "matthew.clark@example.com",
//       "emma.martinez@example.com",
//       "william.taylor@example.com",
//       "isabella.garcia@example.com",
//       "james.wilson@example.com",
//       "oliver.anderson@example.com",
//       "sophie.martinez@example.com",
//       "benjamin.thompson@example.com",
//       "charlotte.moore@example.com",
//     ],
//     classNames: (value) =>
//       typeof value === "string" && value.includes("john")
//         ? "text-green-400 font-medium"
//         : "text-white",
//   },
//   Role: {
//     values: [
//       "CEO",
//       "CTO",
//       "Admin",
//       "Client",
//       "Designer",
//       "Director",
//       "Developer",
//       "Producer",
//       "Designer",
//       "Publisher",
//       "QA",
//       "Manager",
//       "Engineer",
//       "Artist",
//       "Writer",
//       "Analyst",
//       "Architect",
//       "Musician",
//       "Consultant",
//       "Lawyer",
//     ],
//   },
//   Salary: {
//     values: [
//       25000, 13000, 7200, 6850, 9100, 8500, 7900, 10400, 5480, 9150, 3200,
//       12500, 8000, 6000, 7400, 8200, 9500, 8800, 7200, 11000,
//     ],
//     renderValue: (value) => {
//       if (typeof value === "number") {
//         return (
//           <div
//             className={`font-medium ${value > 8000 ? "text-green-400" : "text-red-400"
//               }`}
//           >
//             ${value.toLocaleString()}
//           </div>
//         );
//       }
//       return value;
//     },
//   },
//   Active: {
//     values: [
//       false,
//       true,
//       false,
//       true,
//       false,
//       true,
//       true,
//       false,
//       true,
//       false,
//       true,
//       false,
//       true,
//       false,
//       true,
//       false,
//       true,
//       false,
//       true,
//       false,
//     ],
//     renderBoolean: (value) =>
//       value ? (
//         <IoCheckmarkOutline
//           className={"!text-green-400"}
//           width={"30px"}
//           height={"30px"}
//         />
//       ) : (
//         <IoCloseOutline
//           className={"!text-red-400"}
//           width={"30px"}
//           height={"30px"}
//         />
//       ),
//   },
// };
