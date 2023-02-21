const storage = document.getElementById("storage")
const storageLabel = document.getElementById("storageLabel")
const transfer = document.getElementById("transfer")
const transferLabel = document.getElementById("transferLabel")

const sitesProp = {
    backblaze: {
        storage: 0.005,
        transfer: 0.01,
        minPrice: 7,
        currentPrice: 0,
        color: "red"
    },
    bunny: {
        storage: {
            SSD: 0.02,
            HDD: 0.01,
            lastChange: null
        },
        transfer: 0.01,
        currentPrice: 0,
        color: "orange",
        maxPrice: 10
    },
    scaleway: {
        storage: {
            Multi: 0.06,
            Single: 0.03,
            lastChange: null
        },
        transfer: 0.02,
        currentPrice: 0,
        color: "purple",
        minStorageCapacity: 75
    },
    vultr: {
        storage: 0.01,
        transfer: 0.01,
        minPrice: 5,
        currentPrice: 0,
        color: "blue"
    }
}


if (document.querySelector('input[name="storageType"]')) {
    document.querySelectorAll('input[name="storageType"]').forEach((elem) => {
        elem.addEventListener("change", (event) => {
            calculateForBunny(+storage.value, +transfer.value, event.target.value)
            updateGraph()
        });
    });
}

if (document.querySelector('input[name="Options"]')) {
    document.querySelectorAll('input[name="Options"]').forEach((elem) => {
        elem.addEventListener("change", (event) => {
            calculateForScaleway(+storage.value, +transfer.value, event.target.value)
            updateGraph()
        });
    });
}

storage.addEventListener('input', (event) => {
    storageLabel.textContent = `Storage: ${event.target.value} GB`
    calculateForBackblaze(+event.target.value, +transfer.value)
    calculateForBunny(+event.target.value, +transfer.value)
    calculateForScaleway(+event.target.value, +transfer.value)
    calculateForVultr(+event.target.value, +transfer.value)
    updateGraph()

})
transfer.addEventListener('input', (event) => {
    transferLabel.textContent = `Transfer: ${event.target.value} GB`
    calculateForBackblaze(+storage.value, +event.target.value)
    calculateForBunny(+storage.value, +event.target.value)
    calculateForScaleway(+storage.value, +event.target.value)
    calculateForVultr(+storage.value, +event.target.value)
    updateGraph()
})

function calculateForBackblaze(storageValue, transferValue) {
    const productPrice = (storageValue * sitesProp.backblaze.storage +
        transferValue * sitesProp.backblaze.transfer).toFixed(2)
    if (productPrice < sitesProp.backblaze.minPrice) {
        document.getElementById("backblazePrice").innerHTML = `$${sitesProp.backblaze.minPrice}`;
        sitesProp.backblaze.currentPrice = sitesProp.backblaze.minPrice;
    } else {
        document.getElementById("backblazePrice").innerHTML = `$${productPrice}`;
        sitesProp.backblaze.currentPrice = productPrice;
    }


}

function calculateForBunny(storageValue, transferValue, type = sitesProp.bunny.storage.lastChange) {
    if (!type) {
        return;
    }
    sitesProp.bunny.storage.lastChange = type;
    let productPrice = (storageValue * sitesProp.bunny.storage[sitesProp.bunny.storage.lastChange] +
        transferValue * sitesProp.bunny.transfer).toFixed(2)
    productPrice = productPrice > sitesProp.bunny.maxPrice ? sitesProp.bunny.maxPrice : productPrice;
    document.getElementById("bunnyPrice").innerHTML = `$${productPrice}`;
    sitesProp.bunny.currentPrice = productPrice;
}

function calculateForScaleway(storageValue, transferValue, type = sitesProp.scaleway.storage.lastChange) {
    if (!type) {
        return;
    }
    sitesProp.scaleway.storage.lastChange = type;
    if (storageValue < sitesProp.scaleway.minStorageCapacity && transferValue < sitesProp.scaleway.minStorageCapacity) {
        document.getElementById("scalewayPrice").innerHTML = `$0.00`;
        sitesProp.scaleway.currentPrice = 0;
        return;

    }
    storageValue = storageValue > sitesProp.scaleway.minStorageCapacity ? storageValue : 0;
    transferValue = transferValue > sitesProp.scaleway.minStorageCapacity ? transferValue : 0;
    const productPrice = (storageValue * sitesProp.scaleway.storage[sitesProp.scaleway.storage.lastChange] +
        transferValue * sitesProp.scaleway.transfer).toFixed(2)
    document.getElementById("scalewayPrice").innerHTML = `$${productPrice}`;
    sitesProp.scaleway.currentPrice = productPrice;
}

function calculateForVultr(storageValue, transferValue) {
    const productPrice = (storageValue * sitesProp.vultr.storage +
        transferValue * sitesProp.vultr.transfer).toFixed(2)
    if (productPrice < sitesProp.vultr.minPrice) {
        document.getElementById("vultrPrice").innerHTML = `$${sitesProp.vultr.minPrice}`;
        sitesProp.vultr.currentPrice = sitesProp.backblaze.minPrice;
    } else {
        document.getElementById("vultrPrice").innerHTML = `$${productPrice}`;
        sitesProp.vultr.currentPrice = productPrice;
    }
}

function updateGraph() {
    let bestSite;
    Object.entries(sitesProp)
        .map(site => {
            document.getElementById(site[0]).style.width = `${25 + site[1].currentPrice * 75 / 50}%`
            document.getElementById(site[0]).style.background = 'cadetblue'
            if (!bestSite) {
                return bestSite = site;
            }
            if (+bestSite[1].currentPrice > +site[1].currentPrice) {
                return bestSite = site
            }
        })
    document.getElementById(bestSite[0]).style.background = bestSite[1].color
}


