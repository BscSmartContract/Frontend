let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0xe85f71712aAf6a828f1A683eabf95c473f5E4E0D";
let ABI;

async function loadAbi() {
    const res = await fetch("abi.json");
    ABI = await res.json();
}

// Connect wallet
document.getElementById("connectWallet").onclick = async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        document.getElementById("walletInfo").innerText = "Connected: " + address;
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    } else {
        alert("Please install MetaMask or Binance Wallet!");
    }
};

// Stake tokens
document.getElementById("stakeBtn").onclick = async () => {
    const amount = document.getElementById("stakeAmount").value;
    const ref = document.getElementById("referrer").value || "0x0000000000000000000000000000000000000000";
    if(!contract) return alert("Connect wallet first");

    try {
        const tx = await contract.stake(ethers.utils.parseUnits(amount, 18), ref);
        await tx.wait();
        alert("Stake successful!");
    } catch(e) { console.error(e); alert("Error staking"); }
};

// Claim ROI
document.getElementById("claimRoiBtn").onclick = async () => {
    try {
        const tx = await contract.claimRoi();
        await tx.wait();
        alert("ROI claimed!");
    } catch(e) { console.error(e); alert("Error claiming ROI"); }
};

// Withdraw
document.getElementById("withdrawBtn").onclick = async () => {
    const amount = document.getElementById("withdrawAmount").value;
    try {
        const tx = await contract.withdraw(ethers.utils.parseUnits(amount, 18));
        await tx.wait();
        alert("Withdraw successful!");
    } catch(e){ console.error(e); alert("Error withdrawing");}
};

// Claim Pools
document.getElementById("claimRankPoolBtn").onclick = async () => {
    try {
        const tx = await contract.claimRankPool(1); // example: block 1
        await tx.wait();
        alert("Rank Pool claimed!");
    } catch(e){ console.error(e); alert("Error"); }
};

document.getElementById("claimHighestPoolBtn").onclick = async () => {
    try {
        const tx = await contract.claimHighestStakerPool();
        await tx.wait();
        alert("Highest Pool claimed!");
    } catch(e){ console.error(e); alert("Error"); }
};

document.getElementById("claimHighTierBtn").onclick = async () => {
    try {
        const tx = await contract.claimHighStakerPool(0); // tier 0 example
        await tx.wait();
        alert("High Tier Pool claimed!");
    } catch(e){ console.error(e); alert("Error"); }
};

loadAbi();
