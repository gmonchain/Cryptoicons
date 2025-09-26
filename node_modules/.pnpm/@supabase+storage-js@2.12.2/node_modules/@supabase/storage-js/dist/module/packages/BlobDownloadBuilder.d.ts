import { DownloadResult } from '../lib/types';
import StreamDownloadBuilder from './StreamDownloadBuilder';
export default class BlobDownloadBuilder implements PromiseLike<DownloadResult<Blob>> {
    private downloadFn;
    private shouldThrowOnError;
    constructor(downloadFn: () => Promise<Response>, shouldThrowOnError: boolean);
    asStream(): StreamDownloadBuilder;
    then<TResult1 = DownloadResult<Blob>, TResult2 = never>(onfulfilled?: ((value: DownloadResult<Blob>) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null): Promise<TResult1 | TResult2>;
    private execute;
}
//# sourceMappingURL=BlobDownloadBuilder.d.ts.map