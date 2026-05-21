export type UserRole = 'student' | 'freelancer' | 'admin' | 'guest';

export type Freelancer = {
  id: string;
  name: string;
  course: string;
  expertise: string[];
  rating: number;
  price: number;
  isOnline: boolean;
  isVerified: boolean;
  completedJobs: number;
  reputationLabel: string;
  bio: string;
  avatar: string;
  responseRate: string;
  memberSince: string;
};

export type Errand = {
  id: string;
  title: string;
  budget: number;
  location: string;
  timeAgo: string;
  category: string;
  ownerId: string;
};

export type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
};

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  time: string;
  fromMe: boolean;
};

export type AdminStat = {
  id: string;
  label: string;
  value: string;
};

export const categories = [
  { id: 'tutoring', label: 'Tutoring', icon: 'school-outline' },
  { id: 'programming', label: 'Programming', icon: 'code-outline' },
  { id: 'math', label: 'Math', icon: 'calculator-outline' },
  { id: 'lab', label: 'Lab Assistance', icon: 'flask-outline' },
  { id: 'thesis', label: 'Thesis Formatting', icon: 'document-text-outline' },
  { id: 'research', label: 'Research', icon: 'search-outline' },
  { id: 'review', label: 'Review Sessions', icon: 'book-outline' },
];

export const freelancers: Freelancer[] = [
  {
    id: 'f1',
    name: 'Andrea Cruz',
    course: 'BS Computer Engineering',
    expertise: ['Programming', 'Math', 'Thesis'],
    rating: 4.9,
    price: 180,
    isOnline: true,
    isVerified: true,
    completedJobs: 128,
    reputationLabel: 'Top Tutor',
    bio: 'Focuses on clear explanations and fast turnarounds for projects.',
    avatar: 'AC',
    responseRate: '96%',
    memberSince: '2023',
  },
  {
    id: 'f2',
    name: 'Marco Reyes',
    course: 'BS Mathematics',
    expertise: ['Math', 'Review'],
    rating: 4.7,
    price: 150,
    isOnline: false,
    isVerified: true,
    completedJobs: 84,
    reputationLabel: 'Trusted',
    bio: 'Specializes in problem-solving sessions and exam prep.',
    avatar: 'MR',
    responseRate: '91%',
    memberSince: '2022',
  },
  {
    id: 'f3',
    name: 'Janelle Tan',
    course: 'BS Biology',
    expertise: ['Lab', 'Research'],
    rating: 4.8,
    price: 160,
    isOnline: true,
    isVerified: false,
    completedJobs: 61,
    reputationLabel: 'Reliable',
    bio: 'Lab reports and research formatting with quick feedback.',
    avatar: 'JT',
    responseRate: '93%',
    memberSince: '2024',
  },
  {
    id: 'f4',
    name: 'Paolo Lim',
    course: 'BS Information Technology',
    expertise: ['Programming', 'Thesis'],
    rating: 4.6,
    price: 170,
    isOnline: true,
    isVerified: true,
    completedJobs: 102,
    reputationLabel: 'Verified',
    bio: 'Backend guidance and thesis structure support.',
    avatar: 'PL',
    responseRate: '90%',
    memberSince: '2021',
  },
  {
    id: 'f5',
    name: 'Lia Santos',
    course: 'BS Chemistry',
    expertise: ['Lab', 'Review', 'Research'],
    rating: 4.5,
    price: 140,
    isOnline: false,
    isVerified: false,
    completedJobs: 54,
    reputationLabel: 'Reliable',
    bio: 'Patient walkthroughs for lab computations.',
    avatar: 'LS',
    responseRate: '88%',
    memberSince: '2023',
  },
  {
    id: 'f6',
    name: 'Noel Garcia',
    course: 'BS Civil Engineering',
    expertise: ['Math', 'Review', 'Tutoring'],
    rating: 4.9,
    price: 190,
    isOnline: true,
    isVerified: true,
    completedJobs: 140,
    reputationLabel: 'Top Tutor',
    bio: 'High-impact review sessions focused on core concepts.',
    avatar: 'NG',
    responseRate: '98%',
    memberSince: '2020',
  },
];

export const errands: Errand[] = [
  {
    id: 'e1',
    title: 'Pick up lunch from canteen',
    budget: 120,
    location: 'Main Campus',
    timeAgo: '12m ago',
    category: 'Food',
    ownerId: 'student1@g.batstate-u.edu.ph',
  },
  {
    id: 'e2',
    title: 'Print thesis draft (20 pages)',
    budget: 80,
    location: 'Library',
    timeAgo: '35m ago',
    category: 'Printing',
    ownerId: 'student1@g.batstate-u.edu.ph',
  },
  {
    id: 'e3',
    title: 'Buy lab supplies',
    budget: 150,
    location: 'Engineering Building',
    timeAgo: '1h ago',
    category: 'Supplies',
    ownerId: 'student2@g.batstate-u.edu.ph',
  },
];

export const chats: Chat[] = [
  {
    id: 'c1',
    name: 'Andrea Cruz',
    lastMessage: 'I can start at 3 PM. Does that work?',
    time: '9:42 AM',
    unreadCount: 2,
    isOnline: true,
    avatar: 'AC',
  },
  {
    id: 'c2',
    name: 'Marco Reyes',
    lastMessage: 'Uploaded the practice set.',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    avatar: 'MR',
  },
  {
    id: 'c3',
    name: 'Lia Santos',
    lastMessage: 'Can you share the rubric?',
    time: 'Mon',
    unreadCount: 1,
    isOnline: true,
    avatar: 'LS',
  },
];

export const messages: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', text: 'Hi Andrea, are you free later?', time: '9:30 AM', fromMe: true },
  { id: 'm2', chatId: 'c1', text: 'Yes, I can start at 3 PM.', time: '9:42 AM', fromMe: false },
  { id: 'm3', chatId: 'c1', text: 'Great, see you then.', time: '9:45 AM', fromMe: true },
  { id: 'm4', chatId: 'c2', text: 'Thanks for the materials.', time: 'Yesterday', fromMe: true },
  { id: 'm5', chatId: 'c2', text: 'No problem, check the link.', time: 'Yesterday', fromMe: false },
];

export const adminStats: AdminStat[] = [
  { id: 'a1', label: 'Total Users', value: '1,284' },
  { id: 'a2', label: 'Active Services', value: '312' },
  { id: 'a3', label: 'Open Disputes', value: '8' },
  { id: 'a4', label: 'Pending Verifications', value: '23' },
];

export const popularServices = [
  {
    id: 's1',
    title: 'Calculus Review Session',
    category: 'Math',
    price: 180,
    rating: 4.9,
    tutor: 'Noel Garcia',
  },
  {
    id: 's2',
    title: 'Java Programming Help',
    category: 'Programming',
    price: 200,
    rating: 4.8,
    tutor: 'Andrea Cruz',
  },
  {
    id: 's3',
    title: 'Thesis Formatting Assist',
    category: 'Thesis',
    price: 160,
    rating: 4.7,
    tutor: 'Paolo Lim',
  },
];

export const reviews = [
  {
    id: 'r1',
    name: 'Jan Miguel',
    rating: 5,
    date: 'Apr 10',
    comment: 'Explained everything clearly and gave great tips.',
    avatar: 'JM',
  },
  {
    id: 'r2',
    name: 'Cristina L.',
    rating: 4,
    date: 'Mar 28',
    comment: 'Responsive and helpful during my project.',
    avatar: 'CL',
  },
];
