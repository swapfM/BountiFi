# transaction_status.py
from web3 import Web3
import time
import logging

logger = logging.getLogger(__name__)

# Connect to the BDAG RPC (Primordial)
RPC_URL = "https://rpc.primordial.bdagscan.com"
web3 = Web3(Web3.HTTPProvider(RPC_URL))


async def poll_transaction_status(
    tx_hash: str, timeout: int = 300, interval: int = 10
) -> str:
    """
    Polls the transaction status until it is confirmed or times out.

    Args:
        tx_hash (str): The transaction hash to track.
        timeout (int): Max time in seconds to wait for confirmation.
        interval (int): Time in seconds between checks.

    Returns:
        str: "success" if confirmed, "fail" if dropped, or "timeout"
    """
    elapsed = 0
    while elapsed < timeout:
        try:
            receipt = web3.eth.get_transaction_receipt(tx_hash)
            if receipt and receipt["status"] == 1:
                logger.info(f" Transaction {tx_hash} succeeded.")
                return "success"
            elif receipt and receipt["status"] == 0:
                logger.warning(f" Transaction {tx_hash} failed.")
                return "fail"
        except Exception as e:
            logger.info(f" Waiting for tx {tx_hash}...")

        time.sleep(interval)
        elapsed += interval

    logger.warning(f" Transaction {tx_hash} polling timed out.")
    return "timeout"
