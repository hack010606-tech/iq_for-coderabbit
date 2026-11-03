export interface QueuedResult {
    data?: any;
    error?: any;
    count?: number;
}
export declare class SupabaseMock {
    private results;
    calls: {
        table: string;
        op: string;
        payload?: any;
        columns?: string;
    }[];
    reset(): void;
    queueResult(table: string, result: QueuedResult): this;
    private nextResult;
    from(table: string): any;
    storage: {
        from: () => {
            upload: jest.Mock<any, any, any>;
            getPublicUrl: jest.Mock<any, any, any>;
        };
    };
    auth: {
        admin: {
            signOut: jest.Mock<any, any, any>;
            updateUserById: jest.Mock<any, any, any>;
            createUser: jest.Mock<any, any, any>;
            deleteUser: jest.Mock<any, any, any>;
        };
        signInWithPassword: jest.Mock<any, any, any>;
        refreshSession: jest.Mock<any, any, any>;
        resetPasswordForEmail: jest.Mock<any, any, any>;
        getUser: jest.Mock<any, any, any>;
    };
}
export declare const supabaseMock: SupabaseMock;
