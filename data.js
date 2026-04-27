// Title IV-E Prevention Plan data
// Source: ACF Children's Bureau (https://acf.gov/cb/title-iv-e-prevention-program-five-year-prevention-plans)
// Last refreshed: April 27, 2026
// Built from saved HTML export of the ACF interactive map page.

// Chapin Hall brand colors for map fills
const COLORS = {
  approved: "#800000",   // Maroon
  submitted: "#C16622",  // Warm Orange
  none: "#D6D6CE",       // Light Warm Gray
  highlight: "#F8A429"   // Gold (used when a program is selected)
};

const STATE_DATA = [
  {
    name: "Alabama",
    abbr: "AL",
    status: "not_submitted",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Alaska",
    abbr: "AK",
    status: "not_submitted",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Arizona",
    abbr: "AZ",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Healthy Families America",
      "Parents as Teachers",
      "Nurse-Family Partnership"
    ]
  },
  {
    name: "Arkansas",
    abbr: "AR",
    status: "approved",
    planYears: "FY 2024-2029",
    programs: [
      "Family Centered Treatment",
      "Intercept",
      "SafeCare",
      "Triple P - Positive Parenting Program - Standard (Level 4)",
      "Healthy Families America",
      "Motivational Interviewing"
    ]
  },
  {
    name: "California",
    abbr: "CA",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Brief Strategic Family Therapy",
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Family Check-Up"
    ]
  },
  {
    name: "Colorado",
    abbr: "CO",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Nurse-Family Partnership",
      "SafeCare",
      "Child First",
      "Fostering Healthy Futures for Preteens"
    ]
  },
  {
    name: "Connecticut",
    abbr: "CT",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy"
    ]
  },
  {
    name: "Delaware",
    abbr: "DE",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Motivational Interviewing",
      "Functional Family Therapy",
      "Homebuilders",
      "Brief Strategic Family Therapy",
      "Intercept",
      "Family Check-Up"
    ]
  },
  {
    name: "District of Columbia",
    abbr: "DC",
    status: "submitted",
    planYears: "FY 2025-2029",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing"
    ]
  },
  {
    name: "Florida",
    abbr: "FL",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy"
    ]
  },
  {
    name: "Georgia",
    abbr: "GA",
    status: "approved",
    planYears: "FY 2023-2027",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Brief Strategic Family Therapy",
      "Intercept"
    ]
  },
  {
    name: "Hawaii",
    abbr: "HI",
    status: "approved",
    planYears: "FY 2026-2030",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing",
      "Healthy Families America",
      "Homebuilders"
    ]
  },
  {
    name: "Idaho",
    abbr: "ID",
    status: "approved",
    planYears: "FY 2023-2027",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "Familias Unidas"
    ]
  },
  {
    name: "Illinois",
    abbr: "IL",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Trauma-Focused Cognitive Behavioral Therapy",
      "Child-Parent Psychotherapy",
      "Triple P - Positive Parenting Program - Standard (Level 4)"
    ]
  },
  {
    name: "Indiana",
    abbr: "IN",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Healthy Families America",
      "Trauma-Focused Cognitive Behavioral Therapy"
    ]
  },
  {
    name: "Iowa",
    abbr: "IA",
    status: "approved",
    planYears: "FY 2026-2030",
    programs: [
      "Motivational Interviewing",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "SafeCare",
      "Sobriety Treatment and Recovery Teams (START)"
    ]
  },
  {
    name: "Kansas",
    abbr: "KS",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Parents as Teachers",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Family Check-Up",
      "Family Centered Treatment",
      "Sobriety Treatment and Recovery Teams (START)"
    ]
  },
  {
    name: "Kentucky",
    abbr: "KY",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Parents as Teachers",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Family Check-Up",
      "Family Centered Treatment",
      "Sobriety Treatment and Recovery Teams (START)"
    ]
  },
  {
    name: "Louisiana",
    abbr: "LA",
    status: "approved",
    planYears: "FY 2023-2027",
    programs: [
      "Intercept",
      "Child First"
    ]
  },
  {
    name: "Maine",
    abbr: "ME",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Homebuilders"
    ]
  },
  {
    name: "Maryland",
    abbr: "MD",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Nurse-Family Partnership"
    ]
  },
  {
    name: "Massachusetts",
    abbr: "MA",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Multisystemic Therapy",
      "Brief Strategic Family Therapy",
      "Intercept"
    ]
  },
  {
    name: "Michigan",
    abbr: "MI",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "SafeCare",
      "Family Spirit",
      "Buprenorphine MOUD",
      "Methadone Maintenance Therapy",
      "Naltrexone MOUD"
    ]
  },
  {
    name: "Minnesota",
    abbr: "MN",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing"
    ]
  },
  {
    name: "Mississippi",
    abbr: "MS",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Motivational Interviewing",
      "Homebuilders",
      "Healthy Families America",
      "Intercept"
    ]
  },
  {
    name: "Missouri",
    abbr: "MO",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Brief Strategic Family Therapy",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Parent-Child Interaction Therapy"
    ]
  },
  {
    name: "Montana",
    abbr: "MT",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Nurse-Family Partnership"
    ]
  },
  {
    name: "Nebraska",
    abbr: "NE",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Family Centered Treatment",
      "Trauma-Focused Cognitive Behavioral Therapy",
      "Parents as Teachers"
    ]
  },
  {
    name: "Nevada",
    abbr: "NV",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Motivational Interviewing",
      "Parent-Child Interaction Therapy",
      "Family Check-Up"
    ]
  },
  {
    name: "New Hampshire",
    abbr: "NH",
    status: "approved",
    planYears: "FY 2023-2027",
    programs: [
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Homebuilders",
      "Intercept"
    ]
  },
  {
    name: "New Jersey",
    abbr: "NJ",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Motivational Interviewing",
      "Brief Strategic Family Therapy",
      "Intercept",
      "Triple P - Positive Parenting Program - Group (Level 4)",
      "Triple P - Positive Parenting Program - Standard (Level 4)"
    ]
  },
  {
    name: "New Mexico",
    abbr: "NM",
    status: "approved",
    planYears: "FY 2026-2030",
    programs: [
      "Motivational Interviewing",
      "SafeCare"
    ]
  },
  {
    name: "New York",
    abbr: "NY",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "Family Check-Up",
      "Familias Unidas"
    ]
  },
  {
    name: "North Carolina",
    abbr: "NC",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Homebuilders",
      "Sobriety Treatment and Recovery Teams (START)"
    ]
  },
  {
    name: "North Dakota",
    abbr: "ND",
    status: "approved",
    planYears: "",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "Family Check-Up"
    ]
  },
  {
    name: "Ohio",
    abbr: "OH",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Functional Family Therapy",
      "Parents as Teachers",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Sobriety Treatment and Recovery Teams (START)",
      "Triple P - Positive Parenting Program - Online (Level 4)"
    ]
  },
  {
    name: "Oklahoma",
    abbr: "OK",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Intercept",
      "SafeCare"
    ]
  },
  {
    name: "Oregon",
    abbr: "OR",
    status: "approved",
    planYears: "FY 2026-2030",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Parent-Child Interaction Therapy"
    ]
  },
  {
    name: "Pennsylvania",
    abbr: "PA",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Triple P - Positive Parenting Program - Standard (Level 4)",
      "Incredible Years - School Age Basic Program",
      "Incredible Years - Toddler Basic Program"
    ]
  },
  {
    name: "Rhode Island",
    abbr: "RI",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Familias Unidas"
    ]
  },
  {
    name: "South Carolina",
    abbr: "SC",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Healthy Families America",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "Motivational Interviewing",
      "Intercept",
      "Family Centered Treatment"
    ]
  },
  {
    name: "South Dakota",
    abbr: "SD",
    status: "submitted",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Tennessee",
    abbr: "TN",
    status: "approved",
    planYears: "FY 2022-",
    programs: [
      "Multisystemic Therapy",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Nurse-Family Partnership",
      "Brief Strategic Family Therapy",
      "Intercept"
    ]
  },
  {
    name: "Texas",
    abbr: "TX",
    status: "approved",
    planYears: "FY 2026-2030",
    programs: [
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Multisystemic Therapy",
      "Parents as Teachers",
      "Parent-Child Interaction Therapy",
      "Family Centered Treatment",
      "High Fidelity Wraparound",
      "Trauma-Focused Cognitive Behavioral Therapy",
      "Trust-Based Relational Intervention - Caregiver Training"
    ]
  },
  {
    name: "Utah",
    abbr: "UT",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Functional Family Therapy",
      "Families First (Utah Youth Village Model)",
      "Parent-Child Interaction Therapy",
      "SafeCare"
    ]
  },
  {
    name: "Vermont",
    abbr: "VT",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Motivational Interviewing",
      "Parent-Child Interaction Therapy"
    ]
  },
  {
    name: "Virginia",
    abbr: "VA",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Parent-Child Interaction Therapy",
      "Homebuilders",
      "Motivational Interviewing",
      "Brief Strategic Family Therapy",
      "Family Check-Up",
      "High Fidelity Wraparound"
    ]
  },
  {
    name: "Washington",
    abbr: "WA",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Nurse-Family Partnership",
      "Parents as Teachers",
      "Homebuilders",
      "Functional Family Therapy",
      "Multisystemic Therapy",
      "Parent-Child Interaction Therapy",
      "Motivational Interviewing",
      "Child-Parent Psychotherapy",
      "Promoting First Relationships",
      "SafeCare",
      "Family Spirit",
      "Incredible Years - School Age Basic Program",
      "Incredible Years - Toddler Basic Program",
      "Triple P - Positive Parenting Program - Standard (Level 4)"
    ]
  },
  {
    name: "West Virginia",
    abbr: "WV",
    status: "approved",
    planYears: "FY 2025-2029",
    programs: [
      "Parents as Teachers",
      "Functional Family Therapy",
      "Healthy Families America"
    ]
  },
  {
    name: "Wisconsin",
    abbr: "WI",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Parents as Teachers",
      "Healthy Families America",
      "Nurse-Family Partnership"
    ]
  },
  {
    name: "Wyoming",
    abbr: "WY",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Motivational Interviewing"
    ]
  }
];

const TERRITORY_DATA = [
  {
    name: "American Samoa",
    abbr: "AS",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Commonwealth of the Northern Mariana Islands",
    abbr: "MP",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Federated States of Micronesia",
    abbr: "FM",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Guam",
    abbr: "GU",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Puerto Rico",
    abbr: "PR",
    status: "approved",
    planYears: "FY 2022-2026",
    programs: [
      "Functional Family Therapy",
      "Motivational Interviewing",
      "Brief Strategic Family Therapy"
    ]
  },
  {
    name: "Republic of Palau",
    abbr: "PW",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "Republic of the Marshall Islands",
    abbr: "MH",
    status: "approved",
    planYears: "",
    programs: [
      
    ]
  },
  {
    name: "U.S. Virgin Islands",
    abbr: "VI",
    status: "not_submitted",
    planYears: "",
    programs: [
      
    ]
  }
];

const ALL_DATA = STATE_DATA.concat(TERRITORY_DATA);
