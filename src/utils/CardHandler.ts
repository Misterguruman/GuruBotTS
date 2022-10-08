import { DeckOfCards } from 'card-games-typescript'
import type { Card } from 'card-games-typescript'

export enum CardComparisons {
    card0 = 0,
    card1,
    card2,
    card3,
    card4,
    card5,
    card6,
    card7,
    card8,
    card9,
    cardJ,
    cardQ,
    cardK,
    cardA,
}

export enum SuitEmojis {
    hearts = ":hearts:", 
    spades = ":spades:",
    diamonds = ":diamonds:",
    clubs = ":clubs:"
}

export const Deck = new DeckOfCards()

export function isHigh(firstCard:Card, secondCard:Card):boolean {
    let c1 = `card${firstCard.rank}`
    let c2 = `card${secondCard.rank}`
    if (CardComparisons[c2 as keyof typeof CardComparisons] > CardComparisons[c1 as keyof typeof CardComparisons]) {
        return true
    }

    return false
}

export function isLow(firstCard:Card, secondCard:Card):boolean {
    let c1 = `card${firstCard.rank}`
    let c2 = `card${secondCard.rank}`   
    if (CardComparisons[c2 as keyof typeof CardComparisons] < CardComparisons[c1 as keyof typeof CardComparisons]) {
        return true
    }

    return false
}

export function calculateOddsHigh(d:DeckOfCards, c:Card) {
    let count = d.deck.reduce((acc, cv) => {
        if (CardComparisons[`card${cv.rank}` as keyof typeof CardComparisons] < CardComparisons[`card${c.rank}` as keyof typeof CardComparisons]) {
            return acc + 1
        }
        
        return acc
    }, 0)

    return ((count / d.deck.length)) 

}

export function calculateOddsLow(d:DeckOfCards, c:Card) {
    let count = d.deck.reduce((acc, cv) => {
        if (CardComparisons[`card${cv.rank}` as keyof typeof CardComparisons] > CardComparisons[`card${c.rank}` as keyof typeof CardComparisons]) {
            return acc + 1
        }
        
        return acc
    }, 0)

    return ((count / d.deck.length)) 
}

export function getDiscordValue(c:Card) {
    return `${c.rank} of ${SuitEmojis[c.suite as keyof typeof SuitEmojis]}`
}