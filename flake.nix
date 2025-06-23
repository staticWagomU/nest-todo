{
  description = "NestJS Todo Application Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and package managers
            nodejs_22
            pnpm
            
            # PostgreSQL
            postgresql_15
            
            # Development tools
            turbo
            lefthook

          ];

          shellHook = ''
            echo "🚀 NestJS Todo Development Environment"
            echo "Node.js version: $(node --version)"
            echo "pnpm version: $(pnpm --version)"
            echo "PostgreSQL version: $(postgres --version)"
            echo ""
            echo "Commands available:"
            echo "  pnpm start:dev  - Start both frontend and backend"
            echo "  pnpm build      - Build both applications"
            echo "  pnpm lint       - Run linting"
            echo "  pnpm format     - Format code"
            echo ""
            echo "Make sure to set DATABASE_URL before starting development"
            
            # Initialize PostgreSQL data directory if it doesn't exist
            export PGDATA=$PWD/.postgres
            if [ ! -d "$PGDATA" ]; then
              echo "Initializing PostgreSQL database in $PGDATA"
              initdb --auth-local=peer --auth-host=md5 --encoding=UTF8 --locale=en_US.UTF-8
            fi
          '';

          # Environment variables
          DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/nest_todo";
          NODE_ENV = "development";
        };
      });
}
