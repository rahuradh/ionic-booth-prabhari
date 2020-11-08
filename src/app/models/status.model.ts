export interface Status {
    districtName: string,
    localBodyName: string,
    wardName: string,
    pollingStationName: string,
    totalVotes: number,
    deathVotes: number,
    outOfStationVotes: number,
    outOfWardVotes: number
    expectedPoll: number,
    totalPolled: number,
    panchayatCandidates: number,
    blockPanchayatCandidates: number,
    districtPanchayatCandidates: number
}