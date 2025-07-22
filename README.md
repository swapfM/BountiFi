# BountiFi

BountiFi is a decentralized bounty platform where organizations can post issues with crypto bounties, and contributors (aka Bounty Hunters) can claim, solve, and get rewarded securely via blockchain.
Bounty Hunters can mint a NFT based on their submission counts and experience.

## Project Structure

```
BountiFi/
  ├──backend/  # FastAPI backend and PostgreSQL Database
  |
  └──frontend/
          ├── contracts/
          │   ├── hardhat/
          │   │   ├── contracts/     # Solidity smart contracts
          │   │   ├── scripts/       # Deployment scripts
          │   │   └── test/          # Contract tests
          │   └── foundry/
          │       ├── src/           # Solidity smart contracts
          │       ├── test/          # Contract tests
          │       └── script/        # Deployment scripts
          └── frontend/
              ├── app/               # Next.js application
              ├── components/        # React components
              └── public/            # Static assets

```

## Backend – FastAPI

### Tech Stack

- FastAPI
- PostgreSQL
- JWT Auth
- Uvicorn

### Setup Instructions

1. **Clone Repo**

```bash
git clone https://github.com/swapfM/BountiFi.git
```

2. **Navigate to the backend directory**

```bash
cd backend/
```

3. **Create a virtual environment**

```bash
python -m venv venv
source venv/bin/activate
```

4. **Install dependencies**

```bash
pip install -r requirements.txt
```

5. **Set environment variables** <br/>
   Create a .env file

```
DATABASE_URL="postgresql://user:password@localhost:5432/bountifi"
SECRET_KEY="your_secret_key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

6. **Run the server**

```
uvicorn main:app --reload
```
