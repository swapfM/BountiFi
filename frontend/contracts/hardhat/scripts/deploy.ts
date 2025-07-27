import { ethers } from "hardhat";

const platformAddress = process.env.PLATFORM_ADDRESS;

if (!platformAddress || !ethers.isAddress(platformAddress)) {
  throw new Error(
    "Invalid or missing PLATFORM_ADDRESS in environment variables"
  );
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "BDAG");

  const Escrow = await ethers.getContractFactory("BountyEscrow");

  const escrow = await Escrow.deploy(platformAddress as string);

  await escrow.waitForDeployment();

  const address1 = await escrow.getAddress();
  console.log("Escrow deployed to:", address1);

  const NFT = await ethers.getContractFactory("BountiFiBadge");

  const nft = await NFT.deploy();

  await nft.waitForDeployment();

  const address2 = await nft.getAddress();
  console.log("NFT deployed to:", address2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
