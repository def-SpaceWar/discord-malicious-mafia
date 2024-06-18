export const loadImage = (imageElem: HTMLImageElement, imageUrl: string) => {
    return new Promise<void>((resolve, reject) => {
        imageElem.crossOrigin = "Anonymous";
        imageElem.src = imageUrl;
        imageElem.onload = () => resolve();
        imageElem.onerror = e => reject(e);
    });
};
