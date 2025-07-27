# transaction_status.py
from web3 import Web3
import time
import logging

logger = logging.getLogger(__name__)

RPC_URL = "https://rpc.primordial.bdagscan.com"
web3 = Web3(Web3.HTTPProvider(RPC_URL))


async def poll_transaction_status(
    tx_hash: str, timeout: int = 300, interval: int = 10
) -> str:
    elapsed = 0
    while elapsed < timeout:
        try:
            receipt = web3.eth.get_transaction_receipt(tx_hash)
            if receipt and receipt["status"] == 1:
                logger.info(f" Transaction {tx_hash} succeeded.")
                return "success"
            elif receipt and receipt["status"] == 0:
                logger.warning(f" Transaction {tx_hash} failed.")
                return "failed"
        except Exception as e:
            logger.info(f" Waiting for tx {tx_hash}...")

        time.sleep(interval)
        elapsed += interval

    logger.warning(f" Transaction {tx_hash} polling timed out.")
    return "timeout"
