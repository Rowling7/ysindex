document.addEventListener("DOMContentLoaded", function () {
    const picHsLink = document.getElementById("picHsLink"); // PicHS
    const picMnLink = document.getElementById("picMnLink"); // PicMN
    const picBsLink = document.getElementById("picBsLink"); // PicBS
    const cardContainer = document.getElementById("cardContainer");
    const batchDownloadBtn = document.getElementById("batchDownloadBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");

    // 请求图片数据并渲染卡片
    async function fetchAndRenderImages(apiUrl) {
        cardContainer.innerHTML = "";
        loadingSpinner.classList.remove("d-none"); // 显示加载动画

        try {
            const requests = Array.from({ length: 9 }, () =>
                fetch(apiUrl).then((res) => res.json())
            );

            const results = await Promise.all(requests);
            const imageUrls = results
                .filter((data) => data.code === 200)
                .map((data) => data.data);

            imageUrls.forEach((url) => {
                const col = document.createElement("div");
                col.className = "col-md-4";

                const card = document.createElement("div");
                card.className = "card shadow-sm h-100";

                const img = document.createElement("img");
                img.src = url;
                img.className = "card-img-top";
                img.style.cursor = "pointer";
                img.addEventListener("click", () => {
                    const modal = new bootstrap.Modal(document.getElementById("imagePreviewModal"));
                    document.getElementById("previewImage").src = url;
                    modal.show();
                });

                const cardBody = document.createElement("div");
                cardBody.className = "card-body d-flex flex-column";

                const downloadBtn = document.createElement("button");
                downloadBtn.className = "btn btn-sm btn-primary download-btn";
                downloadBtn.innerHTML = '<i class="bi bi-download"></i> 下载图片';
                downloadBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); // 阻止冒泡到图片点击事件
                    downloadImage(url);
                });

                cardBody.appendChild(downloadBtn);
                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                cardContainer.appendChild(col);
            });
        } catch (error) {
            console.error("获取图片失败:", error);
            cardContainer.innerHTML = "<p class='text-danger'>加载图片失败，请重试。</p>";
        } finally {
            loadingSpinner.classList.add("d-none"); // 隐藏加载动画
        }
    }

    // 跨域图片下载函数
    window.downloadImage = async function (url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("网络响应失败");

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = getFileNameFromURL(url); // 自动命名文件
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);
        } catch (err) {
            alert("下载失败：" + err.message);
            console.error(err);
        }
    };

    // 从 URL 提取文件名（带后缀）
    function getFileNameFromURL(url) {
        const filenameRegex = /\/([^\/?#]+)\.?([^\/?#\.]*)$/;
        const matches = url.match(filenameRegex);
        let name = "image";
        let ext = "jpg";

        if (matches && matches[1] && matches[2]) {
            name = matches[1];
            ext = matches[2];
        } else if (matches && matches[1]) {
            name = matches[1];
        }

        return `${name}.${ext}`;
    }


    batchDownloadBtn.addEventListener("click", async () => {
        const imageElements = cardContainer.querySelectorAll("img.card-img-top");
        if (imageElements.length === 0) {
            alert("没有可下载的图片");
            return;
        }

        batchDownloadBtn.disabled = true;
        batchDownloadBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> 打包中...';

        const zip = new JSZip();
        const folder = zip.folder("downloaded_images");

        let count = 0;

        for (let i = 0; i < imageElements.length; i++) {
            const url = imageElements[i].src;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`下载失败: ${url}`);

                const blob = await response.blob();
                const filename = getFileNameFromURL(url);

                folder.file(filename, blob, { binary: true });
                count++;
            } catch (err) {
                console.error(err);
            }
        }

        if (count === 0) {
            alert("没有成功下载任何图片");
            batchDownloadBtn.disabled = false;
            batchDownloadBtn.innerHTML = '<i class="bi bi-download"></i> 批量下载全部图片';
            return;
        }

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "images-batch-download.zip");

        // 恢复按钮状态
        batchDownloadBtn.disabled = false;
        batchDownloadBtn.innerHTML = '<i class="bi bi-download"></i> 批量下载全部图片';
    });

    // 添加点击事件监听器
    picHsLink.addEventListener("click", function (e) {
        e.preventDefault();
        fetchAndRenderImages("https://v2.xxapi.cn/api/heisi");
    });

    picMnLink.addEventListener("click", function (e) {
        e.preventDefault();
        fetchAndRenderImages("https://v2.xxapi.cn/api/meinvpic");
    });

    picBsLink.addEventListener("click", function (e) {
        e.preventDefault();
        fetchAndRenderImages("https://v2.xxapi.cn/api/baisi");
    });
});