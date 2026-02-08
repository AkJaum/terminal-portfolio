// Simulated file system structure
const fs = {
  home:
  {
    projects:
    {
      websites:
      {
        "meusite.txt": 
          "https://meusite.com",
      },
      curriculum_42:
      {
        push_swap:
        {
          "README.md": 
            "# Push Swap\n\nEste é um projeto da 42 que consiste em ordenar uma pilha de números usando o menor número possível de operações.\n",
        },
        get_next_line:
        {
          "README.md": 
            "# Get Next Line\n\nEste é um projeto da 42 que consiste em ler uma linha de um arquivo descritor de arquivo.\n",
        },
        printf:
        {
          "README.md": 
            "# ft_printf\n\nEste é um projeto da 42 que consiste em reimplementar a função printf da biblioteca padrão do C.\n",
        },
        libft:
        {
          "README.md": 
            "# Libft\n\nEste é um projeto da 42 que consiste em reimplementar funções da biblioteca padrão do C.\n",
        }
      },
    },
    "about.txt": 
      "João Gabriel - Desenvolvedor FullStack\nGitHub: https://github.com/akjaum\n"
  }
};

export default fs;