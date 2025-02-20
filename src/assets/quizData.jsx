// src/quizData.js
export const quizData = {
  networking: [
    {
      question: "What is the OSI model?",
      options: ["Open Systems Interconnection", "Operating System Interface", "Open Software Integration", "Operating Systems Infrastructure"],
      answer: "Open Systems Interconnection",
    },
    {
      question: "What layer of the OSI model is responsible for routing?",
      options: ["Data Link", "Network", "Transport", "Session"],
      answer: "Network",
    },
    {
      question: "Which of these is an example of a connectionless protocol?",
      options: ["TCP", "UDP", "HTTP", "FTP"],
      answer: "UDP",
    },
    {
      question: "Which protocol is used for email transmission?",
      options: ["SMTP", "IMAP", "POP3", "FTP"],
      answer: "SMTP",
    },
    {
      question: "Which type of IP address is used in private networks?",
      options: ["Public IP", "Private IP", "Static IP", "Dynamic IP"],
      answer: "Private IP",
    },
    {
      question: "Which protocol ensures reliable delivery of data?",
      options: ["TCP", "UDP", "ICMP", "HTTP"],
      answer: "TCP",
    },
    {
      question: "Which of the following is a type of network topology?",
      options: ["Bus", "Ring", "Star", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "What does DNS stand for?",
      options: ["Domain Name System", "Domain Name Server", "Dynamic Network Service", "Data Network Service"],
      answer: "Domain Name System",
    },
    {
      question: "What does HTTP stand for?",
      options: ["Hypertext Transfer Protocol", "Hypertext Transport Protocol", "Hyper Transfer Text Protocol", "Hyperlink Text Transfer Protocol"],
      answer: "Hypertext Transfer Protocol",
    },
    {
      question: "Which type of cable is used in Ethernet networks?",
      options: ["Coaxial", "Fiber optic", "Twisted pair", "USB"],
      answer: "Twisted pair",
    },
  ],
  
  operatingSystems: [
    {
      question: "Which of the following is an operating system?",
      options: ["Windows", "MacOS", "Linux", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "What does the acronym OS stand for?",
      options: ["Operating Software", "Open Source", "Operating System", "Online Service"],
      answer: "Operating System",
    },
    {
      question: "Which of the following is used for memory management?",
      options: ["RAM", "CPU", "Cache", "Operating System"],
      answer: "Operating System",
    },
    {
      question: "Which of the following is NOT an example of a process state?",
      options: ["Running", "Ready", "Stopped", "Waking"],
      answer: "Waking",
    },
    {
      question: "Which is the main component of the kernel in an operating system?",
      options: ["File Management", "Memory Management", "Process Management", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which system call is used for file creation?",
      options: ["open()", "create()", "fork()", "write()"],
      answer: "create()",
    },
    {
      question: "Which command is used to list files in Unix?",
      options: ["ls", "dir", "list", "files"],
      answer: "ls",
    },
    {
      question: "Which of these is a Linux distribution?",
      options: ["Ubuntu", "Windows", "MacOS", "Android"],
      answer: "Ubuntu",
    },
    {
      question: "Which scheduling algorithm uses first-come, first-served?",
      options: ["FCFS", "Round-robin", "Shortest Job First", "Priority Scheduling"],
      answer: "FCFS",
    },
    {
      question: "Which of these is a type of file system?",
      options: ["NTFS", "FAT", "ext4", "All of the above"],
      answer: "All of the above",
    },
  ],

  java: [
    {
      question: "Which of the following is NOT a Java keyword?",
      options: ["interface", "extends", "super", "this"],
      answer: "this",
    },
    {
      question: "What is the default value of a boolean variable in Java?",
      options: ["true", "false", "0", "null"],
      answer: "false",
    },
    {
      question: "Which of the following is a valid declaration of an array in Java?",
      options: ["int[] arr;", "int arr[];", "arr int[];", "Both A and B"],
      answer: "Both A and B",
    },
    {
      question: "Which of the following methods is used to find the length of a string in Java?",
      options: ["length()", "getLength()", "size()", "getSize()"],
      answer: "length()",
    },
    {
      question: "Which of the following is NOT a feature of Java?",
      options: ["Platform-independent", "Object-oriented", "Distributed computing", "Manual memory management"],
      answer: "Manual memory management",
    },
    {
      question: "What is the size of the float data type in Java?",
      options: ["4 bytes", "8 bytes", "2 bytes", "16 bytes"],
      answer: "4 bytes",
    },
    {
      question: "Which method is used to start a thread in Java?",
      options: ["start()", "run()", "init()", "execute()"],
      answer: "start()",
    },
    {
      question: "Which of the following classes is part of the java.io package?",
      options: ["FileReader", "BufferedReader", "PrintWriter", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which of these is an example of a non-access modifier in Java?",
      options: ["private", "public", "static", "final"],
      answer: "static",
    },
    {
      question: "Which method is used to compare two strings in Java?",
      options: ["equals()", "compareTo()", "==", "Both A and B"],
      answer: "Both A and B",
    },
  ],

  machineLearning: [
    {
      question: "Which of these is an example of supervised learning?",
      options: ["Linear regression", "K-means clustering", "Principal component analysis", "All of the above"],
      answer: "Linear regression",
    },
    {
      question: "What is the goal of unsupervised learning?",
      options: ["Minimize error", "Group similar data points", "Classify labeled data", "Make predictions"],
      answer: "Group similar data points",
    },
    {
      question: "Which algorithm is used in classification problems?",
      options: ["K-means", "Decision Trees", "PCA", "DBSCAN"],
      answer: "Decision Trees",
    },
    {
      question: "What is overfitting in machine learning?",
      options: ["When the model performs well on both training and testing data", "When the model is too simple", "When the model performs too well on training data but poorly on testing data", "None of the above"],
      answer: "When the model performs too well on training data but poorly on testing data",
    },
    {
      question: "Which technique is used to reduce the dimensionality of data?",
      options: ["PCA", "K-means", "Gradient descent", "Neural networks"],
      answer: "PCA",
    },
    {
      question: "What is the difference between bagging and boosting?",
      options: ["Bagging trains multiple models independently, boosting trains sequentially", "Bagging is faster than boosting", "Boosting is used for regression problems", "Bagging is used for classification problems"],
      answer: "Bagging trains multiple models independently, boosting trains sequentially",
    },
    {
      question: "Which of the following is a type of neural network?",
      options: ["Convolutional neural network (CNN)", "Recurrent neural network (RNN)", "Both A and B", "Decision tree"],
      answer: "Both A and B",
    },
    {
      question: "Which of these is a loss function used for regression problems?",
      options: ["Mean squared error", "Cross-entropy", "Hinge loss", "Log loss"],
      answer: "Mean squared error",
    },
    {
      question: "What does the term 'training data' refer to in machine learning?",
      options: ["Data used for model evaluation", "Data used to train the algorithm", "Data used for feature selection", "None of the above"],
      answer: "Data used to train the algorithm",
    },
    {
      question: "Which of the following algorithms is used for clustering?",
      options: ["K-means", "Logistic regression", "Support vector machines", "Decision trees"],
      answer: "K-means",
    },
  ],

  ai: [
    {
      question: "What is the primary goal of Artificial Intelligence?",
      options: ["To make computers smarter", "To make computers think like humans", "To mimic human intelligence", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which of the following is a key feature of deep learning?",
      options: ["Artificial neural networks", "Clustering", "Decision trees", "All of the above"],
      answer: "Artificial neural networks",
    },
    {
      question: "What does NLP stand for in the context of AI?",
      options: ["Natural Language Processing", "Non-linear Programming", "Neural Language Processing", "Natural Learning Pathways"],
      answer: "Natural Language Processing",
    },
    {
      question: "Which of these is an example of AI in action?",
      options: ["Speech recognition", "Autonomous vehicles", "Recommendation systems", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which technique is commonly used in AI for decision-making?",
      options: ["Search algorithms", "Reinforcement learning", "Genetic algorithms", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which is the most common AI programming language?",
      options: ["Python", "Java", "C++", "Prolog"],
      answer: "Python",
    },
    {
      question: "What does the term 'machine learning' refer to in AI?",
      options: ["The ability of a machine to mimic human behavior", "The ability to learn from data", "The ability to make decisions based on human feedback", "All of the above"],
      answer: "The ability to learn from data",
    },
    {
      question: "What is the difference between AI and machine learning?",
      options: ["AI refers to all aspects of creating intelligent systems, machine learning is a subset of AI", "AI is more advanced than machine learning", "Machine learning is used to build AI models", "None of the above"],
      answer: "AI refers to all aspects of creating intelligent systems, machine learning is a subset of AI",
    },
    {
      question: "Which of the following is used in AI to evaluate models?",
      options: ["Cross-validation", "Train-test split", "Confusion matrix", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which of these is an AI application for healthcare?",
      options: ["Medical imaging", "Predictive diagnostics", "Robot-assisted surgeries", "All of the above"],
      answer: "All of the above",
    },
  ],

  bigDataAnalytics: [
    {
      question: "What is the main characteristic of big data?",
      options: ["Volume", "Variety", "Velocity", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which of the following is a big data framework?",
      options: ["Hadoop", "Spark", "Flink", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "What does Hadoop use for distributed storage?",
      options: ["HDFS", "MapReduce", "NoSQL", "SQL"],
      answer: "HDFS",
    },
    {
      question: "What is the purpose of data preprocessing in big data analytics?",
      options: ["To clean and format data", "To analyze data", "To visualize data", "None of the above"],
      answer: "To clean and format data",
    },
    {
      question: "Which of the following is a type of big data analytics?",
      options: ["Descriptive analytics", "Predictive analytics", "Prescriptive analytics", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which big data processing engine is used for real-time analytics?",
      options: ["Hadoop", "Apache Kafka", "Apache Spark", "All of the above"],
      answer: "Apache Spark",
    },
    {
      question: "Which of these is used for batch processing in big data?",
      options: ["MapReduce", "Hive", "HBase", "Cassandra"],
      answer: "MapReduce",
    },
    {
      question: "What does ETL stand for in the context of big data?",
      options: ["Extract, Transform, Load", "Extract, Transform, Link", "Execute, Transfer, Load", "None of the above"],
      answer: "Extract, Transform, Load",
    },
    {
      question: "Which of the following is a big data visualization tool?",
      options: ["Tableau", "Power BI", "Qlik", "All of the above"],
      answer: "All of the above",
    },
    {
      question: "Which type of database is commonly used for storing big data?",
      options: ["Relational databases", "NoSQL databases", "Graph databases", "All of the above"],
      answer: "NoSQL databases",
    },
  ],
};
