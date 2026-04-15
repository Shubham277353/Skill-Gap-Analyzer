const questionBank = {
  'Frontend Developer': [
    { question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], answer: 0 },
    { question: 'Which HTML tag is used to link an external CSS file?', options: ['<style>', '<css>', '<link>', '<script>'], answer: 2 },
    { question: 'What is a closure in JavaScript?', options: ['A loop construct', 'A function that retains access to its outer scope', 'A CSS property', 'An HTML element'], answer: 1 },
    { question: 'What does the React hook "useState" return?', options: ['Only the state value', 'Only the setter function', 'An array with state value and setter function', 'An object with state and dispatch'], answer: 2 },
    { question: 'Which CSS property creates a flex container?', options: ['display: block', 'display: flex', 'position: flex', 'layout: flex'], answer: 1 },
    { question: 'What is the Virtual DOM in React?', options: ['A direct copy of the real DOM', 'A lightweight in-memory representation of the real DOM', 'A browser API', 'A CSS framework'], answer: 1 },
    { question: 'What does "async/await" do in JavaScript?', options: ['Handles CSS animations', 'Handles asynchronous operations in a synchronous style', 'Creates loops', 'Manages state'], answer: 1 },
    { question: 'Which of the following is NOT a valid CSS unit?', options: ['px', 'em', 'rem', 'dm'], answer: 3 },
    { question: 'What is TypeScript?', options: ['A CSS preprocessor', 'A JavaScript runtime', 'A typed superset of JavaScript', 'A React framework'], answer: 2 },
    { question: 'What is the purpose of the "key" prop in React lists?', options: ['Styling list items', 'Helping React identify which items changed', 'Setting item order', 'Adding event listeners'], answer: 1 }
  ],
  'Backend Developer': [
    { question: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Request State Transfer', 'Resource State Transfer'], answer: 1 },
    { question: 'Which HTTP method is used to update a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], answer: 2 },
    { question: 'What is middleware in Express.js?', options: ['A database layer', 'Functions that execute during request-response cycle', 'A frontend framework', 'A testing tool'], answer: 1 },
    { question: 'What is the purpose of JWT?', options: ['Database querying', 'Styling web pages', 'Securely transmitting information as a JSON object', 'Managing server files'], answer: 2 },
    { question: 'Which of the following is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], answer: 2 },
    { question: 'What does CRUD stand for?', options: ['Create, Read, Update, Delete', 'Connect, Retrieve, Upload, Download', 'Create, Run, Update, Deploy', 'Copy, Read, Undo, Delete'], answer: 0 },
    { question: 'What is the default port for Express.js apps?', options: ['80', '443', '3000', '8080'], answer: 2 },
    { question: 'What is an API endpoint?', options: ['A database table', 'A URL where an API can be accessed', 'A server config file', 'A frontend component'], answer: 1 },
    { question: 'What does "async/await" help with in Node.js?', options: ['Styling', 'Handling asynchronous operations', 'Database schema design', 'Routing'], answer: 1 },
    { question: 'What is the purpose of environment variables?', options: ['Styling the app', 'Storing sensitive config outside source code', 'Managing database schemas', 'Handling HTTP requests'], answer: 1 }
  ],
  'Full Stack Developer': [
    { question: 'What is the difference between client-side and server-side rendering?', options: ['No difference', 'Client-side renders in browser, server-side renders on server', 'Server-side is always faster', 'Client-side uses more memory'], answer: 1 },
    { question: 'Which of the following is a state management library for React?', options: ['Express', 'Redux', 'MongoDB', 'Nginx'], answer: 1 },
    { question: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Client-Origin Request System', 'Cross-Object Resource System', 'Client-Object Routing System'], answer: 0 },
    { question: 'What is the purpose of a .env file?', options: ['Store HTML templates', 'Store environment-specific configuration', 'Store CSS variables', 'Store database records'], answer: 1 },
    { question: 'What does npm stand for?', options: ['Node Package Manager', 'New Project Manager', 'Node Project Module', 'Network Package Module'], answer: 0 },
    { question: 'What is the purpose of Git?', options: ['Database management', 'Version control system', 'Web server', 'CSS framework'], answer: 1 },
    { question: 'What is Mongoose in Node.js?', options: ['A testing framework', 'An ODM for MongoDB', 'A CSS preprocessor', 'A routing library'], answer: 1 },
    { question: 'What is a RESTful API?', options: ['An API that uses GraphQL', 'An API following REST architectural constraints', 'An API built with Python', 'An API that only uses GET requests'], answer: 1 },
    { question: 'What is a React component?', options: ['A CSS class', 'A reusable piece of UI', 'A database model', 'A server route'], answer: 1 },
    { question: 'What does "deployment" mean in web development?', options: ['Writing code', 'Making an app available on the internet', 'Testing an app', 'Designing UI'], answer: 1 }
  ],
  'DevOps Engineer': [
    { question: 'What is Docker used for?', options: ['Frontend development', 'Containerizing applications', 'Database management', 'UI design'], answer: 1 },
    { question: 'What does CI/CD stand for?', options: ['Code Integration/Code Deployment', 'Continuous Integration/Continuous Deployment', 'Container Integration/Container Deployment', 'Cloud Integration/Cloud Deployment'], answer: 1 },
    { question: 'What is Kubernetes?', options: ['A programming language', 'A container orchestration platform', 'A cloud provider', 'A monitoring tool'], answer: 1 },
    { question: 'What is Infrastructure as Code (IaC)?', options: ['Writing frontend code', 'Managing infrastructure through config files', 'A programming paradigm', 'A testing methodology'], answer: 1 },
    { question: 'What is the purpose of a load balancer?', options: ['Store data', 'Distribute traffic across multiple servers', 'Monitor logs', 'Build containers'], answer: 1 },
    { question: 'What is Terraform?', options: ['A monitoring tool', 'An IaC tool for provisioning infrastructure', 'A CI/CD pipeline tool', 'A container runtime'], answer: 1 },
    { question: 'What does "git pull" do?', options: ['Pushes code to remote', 'Fetches and merges remote changes', 'Creates a new branch', 'Deletes a branch'], answer: 1 },
    { question: 'What is a Dockerfile?', options: ['A config file for building Docker images', 'A deployment script', 'A monitoring config', 'A network config'], answer: 0 },
    { question: 'What is AWS?', options: ['A programming language', 'A cloud computing platform by Amazon', 'A DevOps tool', 'A container runtime'], answer: 1 },
    { question: 'What is the purpose of monitoring in DevOps?', options: ['Writing code', 'Tracking system health and performance', 'Building containers', 'Managing databases'], answer: 1 }
  ],
  'Cybersecurity Specialist': [
    { question: 'What is a firewall?', options: ['A type of malware', 'A network security system that monitors traffic', 'A programming language', 'A database tool'], answer: 1 },
    { question: 'What does SQL injection exploit?', options: ['Network vulnerabilities', 'Unsanitized database queries', 'Weak passwords', 'Outdated software'], answer: 1 },
    { question: 'What is phishing?', options: ['A network protocol', 'A social engineering attack to steal credentials', 'A type of encryption', 'A firewall rule'], answer: 1 },
    { question: 'What is the purpose of encryption?', options: ['Speed up data transfer', 'Convert data into unreadable format to protect it', 'Compress files', 'Monitor network traffic'], answer: 1 },
    { question: 'What is penetration testing?', options: ['Testing app performance', 'Simulating attacks to find vulnerabilities', 'Testing database queries', 'Testing UI components'], answer: 1 },
    { question: 'What does HTTPS provide over HTTP?', options: ['Faster speeds', 'Encrypted communication', 'Better SEO', 'More features'], answer: 1 },
    { question: 'What is a zero-day vulnerability?', options: ['A known and patched bug', 'An unknown vulnerability with no available fix', 'A type of firewall', 'A network protocol'], answer: 1 },
    { question: 'What is two-factor authentication (2FA)?', options: ['Using two passwords', 'Verifying identity with two different methods', 'Encrypting data twice', 'Using two firewalls'], answer: 1 },
    { question: 'What is the CIA triad in cybersecurity?', options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Code, Integrity, Access', 'Cyber, Intelligence, Analysis'], answer: 1 },
    { question: 'What is a VPN?', options: ['A type of malware', 'Virtual Private Network for secure connections', 'A firewall type', 'A database system'], answer: 1 }
  ],
  'Data Scientist': [
    { question: 'What is overfitting in machine learning?', options: ['Model performs well on training but poorly on new data', 'Model is too simple', 'Model trains too slowly', 'Model uses too little data'], answer: 0 },
    { question: 'What does the pandas library primarily handle?', options: ['Data visualization', 'Data manipulation and analysis', 'Machine learning', 'Web scraping'], answer: 1 },
    { question: 'What is a confusion matrix used for?', options: ['Data cleaning', 'Evaluating classification model performance', 'Feature engineering', 'Data visualization'], answer: 1 },
    { question: 'What is the purpose of train/test split?', options: ['Speed up training', 'Evaluate model on unseen data', 'Reduce dataset size', 'Improve accuracy always'], answer: 1 },
    { question: 'What is normalization in data preprocessing?', options: ['Removing duplicates', 'Scaling features to a standard range', 'Filling missing values', 'Encoding categories'], answer: 1 },
    { question: 'What does SQL SELECT statement do?', options: ['Insert data', 'Retrieve data from a database', 'Delete data', 'Update data'], answer: 1 },
    { question: 'What is a neural network?', options: ['A type of database', 'A computing system inspired by biological neural networks', 'A data visualization tool', 'A SQL query'], answer: 1 },
    { question: 'What library is commonly used for data visualization in Python?', options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'], answer: 2 },
    { question: 'What is a feature in machine learning?', options: ['A model output', 'An input variable used for prediction', 'A training algorithm', 'A loss function'], answer: 1 },
    { question: 'What is cross-validation used for?', options: ['Data cleaning', 'Robust model evaluation using multiple splits', 'Feature selection', 'Data visualization'], answer: 1 }
  ],
  'Machine Learning Engineer': [
    { question: 'What is gradient descent?', options: ['A data cleaning technique', 'An optimization algorithm to minimize loss', 'A neural network type', 'A feature selection method'], answer: 1 },
    { question: 'What is the purpose of a loss function?', options: ['Visualize data', 'Measure how wrong model predictions are', 'Clean data', 'Select features'], answer: 1 },
    { question: 'What is transfer learning?', options: ['Moving data between servers', 'Using a pre-trained model on a new task', 'Transferring model weights manually', 'A data augmentation technique'], answer: 1 },
    { question: 'What does backpropagation do?', options: ['Forward pass through network', 'Calculates gradients to update weights', 'Loads training data', 'Evaluates model'], answer: 1 },
    { question: 'What is a hyperparameter?', options: ['A model weight', 'A configuration set before training', 'A training data point', 'A loss value'], answer: 1 },
    { question: 'What is dropout in neural networks used for?', options: ['Speed up training', 'Prevent overfitting by randomly disabling neurons', 'Increase model size', 'Improve data quality'], answer: 1 },
    { question: 'What is MLOps?', options: ['A Python library', 'Practices for deploying and maintaining ML models in production', 'A neural network architecture', 'A data format'], answer: 1 },
    { question: 'What is a CNN primarily used for?', options: ['Text processing', 'Image recognition', 'Time series', 'Tabular data'], answer: 1 },
    { question: 'What is PyTorch?', options: ['A data visualization library', 'An open-source deep learning framework', 'A database tool', 'A cloud platform'], answer: 1 },
    { question: 'What is batch normalization used for?', options: ['Reduce dataset size', 'Stabilize and speed up training', 'Select features', 'Evaluate model'], answer: 1 }
  ],
  'Cloud Architect': [
    { question: 'What is cloud computing?', options: ['Local server management', 'Delivering computing services over the internet', 'A programming paradigm', 'A database type'], answer: 1 },
    { question: 'What is auto-scaling?', options: ['Manual server management', 'Automatically adjusting resources based on demand', 'A backup strategy', 'A security feature'], answer: 1 },
    { question: 'What is a microservices architecture?', options: ['A monolithic application', 'Small independent services that work together', 'A database design', 'A frontend pattern'], answer: 1 },
    { question: 'What is serverless computing?', options: ['Computing without any servers', 'Running code without managing server infrastructure', 'Offline computing', 'Local computing'], answer: 1 },
    { question: 'What is AWS S3?', options: ['A compute service', 'An object storage service', 'A database service', 'A networking service'], answer: 1 },
    { question: 'What is a VPC in cloud computing?', options: ['Virtual Private Cloud - isolated network environment', 'Very Powerful Computer', 'Virtual Processing Core', 'Verified Private Connection'], answer: 0 },
    { question: 'What is IAM in AWS used for?', options: ['Infrastructure management', 'Managing user access and permissions', 'Instance monitoring', 'Image management'], answer: 1 },
    { question: 'What is Terraform used for?', options: ['Container management', 'Infrastructure as Code provisioning', 'Application monitoring', 'Database management'], answer: 1 },
    { question: 'What is high availability in cloud architecture?', options: ['Fast processing speed', 'System remains operational with minimal downtime', 'High storage capacity', 'High network speed'], answer: 1 },
    { question: 'What is the purpose of a CDN?', options: ['Database management', 'Delivering content from servers closest to users', 'Security monitoring', 'Code deployment'], answer: 1 }
  ],
  'Mobile Developer': [
    { question: 'What is React Native?', options: ['A web framework', 'A framework for building native mobile apps using React', 'A CSS library', 'A backend framework'], answer: 1 },
    { question: 'What is Flutter?', options: ['A JavaScript framework', "Google's UI toolkit for cross-platform apps", 'A database tool', 'A cloud service'], answer: 1 },
    { question: 'What is an APK file?', options: ['iOS app package', 'Android application package', 'A config file', 'A database file'], answer: 1 },
    { question: 'What is the purpose of AsyncStorage in React Native?', options: ['Network requests', 'Persistent local storage', 'UI rendering', 'Navigation'], answer: 1 },
    { question: 'What is Expo in React Native development?', options: ['A testing tool', 'A platform that simplifies React Native development', 'A state management library', 'A UI component library'], answer: 1 },
    { question: 'What is the purpose of navigation in mobile apps?', options: ['Data storage', 'Moving between screens', 'API calls', 'State management'], answer: 1 },
    { question: 'What is a push notification?', options: ['A UI component', 'A message sent to user device from server', 'A navigation method', 'A storage type'], answer: 1 },
    { question: 'What is the difference between native and hybrid apps?', options: ['No difference', 'Native uses platform-specific code, hybrid uses web technologies', 'Hybrid is always faster', 'Native uses web technologies'], answer: 1 },
    { question: 'What is state management in mobile development?', options: ['Managing app storage', 'Managing and sharing data across components', 'Managing app navigation', 'Managing API calls'], answer: 1 },
    { question: 'What is the App Store?', options: ["Google's app distribution platform", "Apple's app distribution platform", 'A code repository', 'A cloud service'], answer: 1 }
  ],
  'UI/UX Designer': [
    { question: 'What is a wireframe?', options: ['A finished design', 'A low-fidelity layout sketch of a UI', 'A CSS framework', 'A color palette'], answer: 1 },
    { question: 'What is the purpose of user research?', options: ['Writing code', 'Understanding user needs and behaviors', 'Creating color schemes', 'Building prototypes'], answer: 1 },
    { question: 'What is a design system?', options: ['A software tool', 'A collection of reusable components and guidelines', 'A color palette', 'A wireframe tool'], answer: 1 },
    { question: 'What does UX stand for?', options: ['User Experience', 'User Extension', 'Unified Experience', 'User Execution'], answer: 0 },
    { question: 'What is the purpose of prototyping?', options: ['Final product delivery', 'Testing and validating design ideas before development', 'Writing documentation', 'Creating databases'], answer: 1 },
    { question: 'What is accessibility in UI design?', options: ['Making apps faster', 'Designing for users with disabilities', 'Adding animations', 'Improving SEO'], answer: 1 },
    { question: 'What is Figma?', options: ['A programming language', 'A collaborative UI design tool', 'A CSS framework', 'A testing tool'], answer: 1 },
    { question: 'What is the 60-30-10 rule in design?', options: ['A grid system', 'A color distribution rule (dominant, secondary, accent)', 'A typography rule', 'A spacing rule'], answer: 1 },
    { question: 'What is a user persona?', options: ['A real user', 'A fictional representation of a target user', 'A design pattern', 'A UI component'], answer: 1 },
    { question: 'What is visual hierarchy?', options: ['A CSS property', 'Arranging elements to show their order of importance', 'A color scheme', 'A layout grid'], answer: 1 }
  ],
  'Blockchain Developer': [
    { question: 'What is a smart contract?', options: ['A legal document', 'Self-executing code stored on a blockchain', 'A database query', 'A network protocol'], answer: 1 },
    { question: 'What is Solidity?', options: ['A database language', 'A programming language for Ethereum smart contracts', 'A blockchain platform', 'A consensus algorithm'], answer: 1 },
    { question: 'What is a blockchain?', options: ['A type of database', 'A distributed ledger of immutable records', 'A programming language', 'A cloud service'], answer: 1 },
    { question: 'What is Web3?', options: ['The third version of HTML', 'A decentralized internet built on blockchain', 'A JavaScript framework', 'A cloud platform'], answer: 1 },
    { question: 'What is gas in Ethereum?', options: ['A cryptocurrency', 'A fee paid for executing transactions', 'A consensus mechanism', 'A smart contract type'], answer: 1 },
    { question: 'What is an NFT?', options: ['Network File Transfer', 'Non-Fungible Token - unique digital asset', 'New Financial Token', 'Network Function Token'], answer: 1 },
    { question: 'What is DeFi?', options: ['Defined Finance', 'Decentralized Finance - financial services on blockchain', 'Default Finance', 'Digital Finance'], answer: 1 },
    { question: 'What is a crypto wallet?', options: ['A physical wallet', 'Software to store and manage crypto keys', 'A blockchain node', 'A smart contract'], answer: 1 },
    { question: 'What is the purpose of Web3.js?', options: ['Frontend styling', 'Interacting with Ethereum blockchain from JavaScript', 'Database management', 'Server-side rendering'], answer: 1 },
    { question: 'What is a consensus mechanism?', options: ['A UI pattern', 'A method for nodes to agree on blockchain state', 'A smart contract type', 'A wallet type'], answer: 1 }
  ],
  'Data Engineer': [
    { question: 'What is an ETL pipeline?', options: ['A network protocol', 'Extract, Transform, Load - moving data between systems', 'A machine learning model', 'A database type'], answer: 1 },
    { question: 'What is Apache Spark used for?', options: ['Web development', 'Large-scale data processing', 'UI design', 'Network security'], answer: 1 },
    { question: 'What is a data warehouse?', options: ['A physical storage facility', 'A system for storing and analyzing large amounts of structured data', 'A real-time database', 'A NoSQL database'], answer: 1 },
    { question: 'What is Apache Kafka?', options: ['A database', 'A distributed event streaming platform', 'A data visualization tool', 'A machine learning library'], answer: 1 },
    { question: 'What is a data lake?', options: ['A structured database', 'A storage repository for raw data in any format', 'A visualization tool', 'A streaming platform'], answer: 1 },
    { question: 'What is Apache Airflow?', options: ['A database tool', 'A workflow orchestration platform for data pipelines', 'A streaming platform', 'A visualization tool'], answer: 1 },
    { question: 'What is partitioning in databases?', options: ['Deleting data', 'Dividing data into smaller manageable pieces', 'Encrypting data', 'Backing up data'], answer: 1 },
    { question: 'What is a star schema?', options: ['A network topology', 'A data warehouse schema with fact and dimension tables', 'A database index type', 'A data format'], answer: 1 },
    { question: 'What is the difference between OLTP and OLAP?', options: ['No difference', 'OLTP handles transactions, OLAP handles analytics', 'OLAP handles transactions, OLTP handles analytics', 'Both handle the same workloads'], answer: 1 },
    { question: 'What is the purpose of data normalization?', options: ['Speed up queries always', 'Reduce data redundancy and improve integrity', 'Increase storage', 'Improve visualization'], answer: 1 }
  ]
};

module.exports = questionBank;
