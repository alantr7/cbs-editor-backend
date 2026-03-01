export class Version {
    
    public static readonly ALPHA: number = 0;
    public static readonly BETA: number = 1;
    public static readonly RELEASE: number = 255;
    private static readonly VERSION_REGEX: RegExp = /^\d+(\.\d+)*[ab]?$/;
    public static readonly INVALID: Version = new Version([], Version.ALPHA);

    public static readonly V_0_5_1_MULTIPLE_FILES_EDITING = Version.from("0.5.1");
    
    private readonly segments: number[];
    public readonly channel: number;
    public readonly stringified: string;

    private constructor(segments: number[], channel: number) {
        this.segments = segments;
        this.channel = channel;
        this.stringified = segments.join(".") + Version.getChannelChar(channel);
    }

    public static from(input: string): Version {
        if (!Version.VERSION_REGEX.test(input)) {
            return Version.INVALID;
        }
        let channel: number;
        if (input.endsWith("a") || input.endsWith("b")) {
            channel = input.endsWith("a") ? Version.ALPHA : Version.BETA;
            input = input.slice(0, -1);
        } else {
            channel = Version.RELEASE;
        }

        const rawSegments = input.includes(".") ? input.split(".") : [input];
        const segments = rawSegments.map(Version.toSegment);

        return new Version(segments, channel);
    }

    private static toSegment(input: string): number {
        return parseInt(input, 10);
    }

    public isValid(): boolean {
        return this !== Version.INVALID;
    }

    public isOlderThan(version: Version): boolean {
        return this.compare(version) < 0;
    }

    public isNewerThan(version: Version): boolean {
        return this.compare(version) > 0;
    }

    private compare(version: Version): number {
        if (this === Version.INVALID) return -1;
        if (version === Version.INVALID) return 1;

        const minLength = Math.min(this.segments.length, version.segments.length);
        for (let i = 0; i < minLength; i++) {
            if (this.segments[i] < version.segments[i]) return -1;
            if (this.segments[i] > version.segments[i]) return 1;
        }

        if (this.segments.length === version.segments.length) {
            return Version.compareChannel(this.channel, version.channel);
        }

        const greaterSegment = this.segments.length === minLength ? version.segments : this.segments;
        for (let i = minLength; i < greaterSegment.length; i++) {
            if (greaterSegment[i] !== 0) {
                return greaterSegment === this.segments ? 1 : -1;
            }
        }

        return Version.compareChannel(this.channel, version.channel);
    }

    private static compareChannel(ch1: number, ch2: number): number {
        return ch1 - ch2;
    }

    private static getChannelChar(channel: number): string {
        switch (channel) {
            case Version.ALPHA:
                return "a";
            case Version.BETA:
                return "b";
            default:
                return "";
        }
    }
    
}