const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const shakaContractFactory = await hre.ethers.getContractFactory("shakaPortal");
  const shakaContract = await shakaContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.1"),
  });
  await shakaContract.deployed();

  console.log("Contract deployed to:", shakaContract.address);
  console.log("Contract deployed by:", owner.address);

  /*
   * Get Contract balance
   */
  let contractBalance = await hre.ethers.provider.getBalance(
    shakaContract.address
  );
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let shakaCount;
  let fwens;
  shakaCount = await shakaContract.getTotalShakas();
  fwens = await shakaContract.getFwens();

  let shakaTxn = await shakaContract.shaka("first shaka message");
  await shakaTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(shakaContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  shakaCount = await shakaContract.getTotalShakas();
  fwens = await shakaContract.getFwens();
  await shakaTxn.wait();

  // const [_, randomPerson] = await hre.ethers.getSigners();
  shakaTxn = await shakaContract.connect(randomPerson).shaka("shaka message by randomPerson");
  await shakaTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(shakaContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  shakaCount = await shakaContract.getTotalShakas();
  fwens = await shakaContract.getFwens();

  shakaTxn = await shakaContract.shaka("third shaka message");
  await shakaTxn.wait();

  /*
   * Get Contract balance to see what happened!
   */
  contractBalance = await hre.ethers.provider.getBalance(shakaContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allShakas = await shakaContract.getAllShakas();
  console.log(allShakas);

};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
