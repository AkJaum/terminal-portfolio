// Backend core: simulated tree filesystem (single source of truth)
const filesystem = {
  home: {
    dungeon4fun: "launcher://dungeon4fun",
    Terminal: "launcher://terminal",
    README: "__REF__:src/README.md",
    projects: {
      websites: {
        "RegulamentaAI.web": "https://regulamentaai.com/",
        "Wowlinette.web": "https://wowlinette.vercel.app/",
        "Pink Palace.web": "https://pinkpalace.vercel.app/",
        "Trabalho Acadêmico.web": "https://projeto-neurologia.vercel.app/",
        "Quiz Administrativo.web": "https://empreendendo-minions-quiz.vercel.app/",
      },
      curriculum_42: {
        push_swap: {
          "README.md": "*This project has been created as part of the 42 curriculum by \\<jneris-d\\>.*\n\n## Description\n\nThe **push_swap** project consists of sorting a stack of integers using a limited set of operations and an auxiliary stack.\nThe goal is not only to sort the numbers correctly, but also to **optimize the number of operations** used during the process.\n\nThe allowed operations are:\n\n- **Swap**\n  Swaps the first two elements of a stack.\n\n- **Push**\n  Takes the first element of one stack and pushes it onto the other stack.\n\n- **Rotate**\n  Shifts all elements of a stack up by one position, moving the first element to the bottom.\n\n- **Reverse rotate**\n  Shifts all elements of a stack down by one position, moving the last element to the top.\n\nThis project focuses heavily on algorithmic efficiency, especially for larger input sizes, where choosing the right sorting strategy is essential.\n\n## Instructions\n\nTo compile the project, run make.\nAfter compilation, execute the program by passing a list of integers as arguments:\n./push_swap \"5 8 2 6 0\"\n\nIf all arguments are valid, the program will print the sequence of operations used to sort the stack. To count the total number of operations, you can pipe the output to wc -l\n\n## Resources\n\nTo complete this project, I studied and applied several computer science concepts:\n- Stack-based sorting algorithms and constrained-operation problem solving.\n- Radix Sort and its adaptation for sorting using two stacks.\n- Indexing and normalization techniques to optimize comparisons.\n- Algorithmic optimization focused on minimizing the number of operations.\n\nThese topics were explored through:\n- Educational tutorials and explanations available on YouTube.\n\nAdditionally, AI assistance was used as a learning and debugging tool to:\n- Clarify algorithmic concepts.\n- Improve code structure.\n- Discuss optimization strategies and memory management.",
        },
        get_next_line: {
          "README.md": "# Get Next Line\n\nEste é um projeto da 42 que consiste em ler uma linha de um arquivo descritor de arquivo.\n",
        },
        printf: {
          "README.md": "# ft_printf\n\nEste é um projeto da 42 que consiste em reimplementar a função printf da biblioteca padrão do C.\n",
        },
        libft: {
          "README.md": "# Libft\n\nEste é um projeto da 42 que consiste em reimplementar funções da biblioteca padrão do C.\n",
        },
      },
    },
  },
};

export default filesystem;
